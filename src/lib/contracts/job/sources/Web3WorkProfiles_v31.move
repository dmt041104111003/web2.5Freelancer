module did_addr_profile::web3_profiles_v31 {
	use std::signer;
	use std::vector;
	use aptos_std::table;
	use aptos_framework::event::{EventHandle, emit_event};
	use aptos_framework::account;
	use aptos_framework::timestamp;
	use did_addr_profile::did_registry_v1;

	friend job_work_board::dao_vote;

	const EMODULE_NOT_INITIALIZED: u64 = 1;
	const EPROFILE_EXISTS: u64 = 2;
	const EPROFILE_NOT_FOUND: u64 = 3;
	const ENOT_OWNER: u64 = 4;
	const ENOT_VERIFIED_DID: u64 = 5;
	const MAX_TRUST_SCORE: u64 = 100;
	const EVERIFICATION_CID_IMMUTABLE: u64 = 6;

	struct Profile has store, copy, drop {
		did_hash: vector<u8>,
		verification_cid: vector<u8>, 
		profile_cids: vector<vector<u8>>, 
		trust_score: u64,
		created_at: u64,
	}

	struct Profiles has key { profiles: table::Table<address, Profile> }

	struct Events has key {
		registered: EventHandle<ProfileRegistered>,
		profile_updated: EventHandle<ProfileUpdated>,
		profile_cid_added: EventHandle<ProfileCidAdded>,
	}

	struct ProfileRegistered has store, drop {
		user: address,
		did_hash: vector<u8>,
		verification_cid: vector<u8>,
		profile_cids: vector<vector<u8>>,
		time: u64,
	}

	struct ProfileUpdated has store, drop {
		user: address,
		profile_cids: vector<vector<u8>>,
		time: u64,
	}

	struct ProfileCidAdded has store, drop {
		user: address,
		new_cid: vector<u8>,
		time: u64,
	}

	public entry fun initialize(account: &signer) {
		let owner = signer::address_of(account);
		assert!(owner == @did_addr_profile, ENOT_OWNER);
		if (!exists<Profiles>(owner)) {
			move_to(account, Profiles { profiles: table::new<address, Profile>() });
		};
		if (!exists<Events>(owner)) {
			move_to(account, Events {
				registered: account::new_event_handle<ProfileRegistered>(account),
				profile_updated: account::new_event_handle<ProfileUpdated>(account),
				profile_cid_added: account::new_event_handle<ProfileCidAdded>(account),
			});
		};
	}

	public entry fun register_profile(account: &signer, verification_cid: vector<u8>, initial_profile_cid: vector<u8>) acquires Profiles, Events {
		let user = signer::address_of(account);
		assert!(exists<Profiles>(@did_addr_profile), EMODULE_NOT_INITIALIZED);
		assert!(did_registry_v1::has_verified_did(user), ENOT_VERIFIED_DID);
		let did_hash = did_registry_v1::get_did_hash(user);

		let store = borrow_global_mut<Profiles>(@did_addr_profile);
		assert!(!table::contains(&store.profiles, user), EPROFILE_EXISTS);
		let now = timestamp::now_seconds();
		
		let profile_cids = vector::empty<vector<u8>>();
		vector::push_back(&mut profile_cids, initial_profile_cid);
		
		table::add(&mut store.profiles, user, Profile { 
			did_hash, 
			verification_cid, 
			profile_cids, 
			trust_score: 0, 
			created_at: now 
		});

		let events = borrow_global_mut<Events>(@did_addr_profile);
		emit_event(&mut events.registered, ProfileRegistered { 
			user, 
			did_hash, 
			verification_cid, 
			profile_cids, 
			time: now 
		});
	}

	// Chỉ có thể cập nhật profile CIDs, không thể cập nhật verification CID
	public entry fun update_profile_cids(account: &signer, new_profile_cids: vector<vector<u8>>) acquires Profiles, Events {
		let user = signer::address_of(account);
		assert!(exists<Profiles>(@did_addr_profile), EMODULE_NOT_INITIALIZED);
		let store = borrow_global_mut<Profiles>(@did_addr_profile);
		assert!(table::contains(&store.profiles, user), EPROFILE_NOT_FOUND);
		let p = table::borrow_mut(&mut store.profiles, user);
		p.profile_cids = new_profile_cids;
		let now = timestamp::now_seconds();
		let events = borrow_global_mut<Events>(@did_addr_profile);
		emit_event(&mut events.profile_updated, ProfileUpdated { 
			user, 
			profile_cids: p.profile_cids, 
			time: now 
		});
	}

	// Thêm CID mới vào list profile CIDs
	public entry fun add_profile_cid(account: &signer, new_cid: vector<u8>) acquires Profiles, Events {
		let user = signer::address_of(account);
		assert!(exists<Profiles>(@did_addr_profile), EMODULE_NOT_INITIALIZED);
		let store = borrow_global_mut<Profiles>(@did_addr_profile);
		assert!(table::contains(&store.profiles, user), EPROFILE_NOT_FOUND);
		let p = table::borrow_mut(&mut store.profiles, user);
		vector::push_back(&mut p.profile_cids, new_cid);
		let now = timestamp::now_seconds();
		let events = borrow_global_mut<Events>(@did_addr_profile);
		emit_event(&mut events.profile_cid_added, ProfileCidAdded { 
			user, 
			new_cid, 
			time: now 
		});
	}

	#[view]
	public fun has_profile(user: address): bool acquires Profiles { 
		let s = borrow_global<Profiles>(@did_addr_profile); 
		table::contains(&s.profiles, user) 
	}

	#[view]
	public fun get_profile_by_address(user: address): Profile acquires Profiles {
		let s = borrow_global<Profiles>(@did_addr_profile);
		assert!(table::contains(&s.profiles, user), EPROFILE_NOT_FOUND);
		*table::borrow(&s.profiles, user)
	}

	#[view]
	public fun get_profile_by_did_hash(did_hash: vector<u8>): Profile acquires Profiles {
		let controller = did_registry_v1::resolve_controller_by_hash(did_hash);
		let s = borrow_global<Profiles>(@did_addr_profile);
		assert!(table::contains(&s.profiles, controller), EPROFILE_NOT_FOUND);
		*table::borrow(&s.profiles, controller)
	}

	#[view]
	public fun get_trust_score_by_address(user: address): u64 acquires Profiles {
		let s = borrow_global<Profiles>(@did_addr_profile);
		let p = table::borrow(&s.profiles, user);
		p.trust_score
	}

	// Helper function to get verification CID (IMMUTABLE)
	#[view]
	public fun get_verification_cid_by_address(user: address): vector<u8> acquires Profiles {
		let s = borrow_global<Profiles>(@did_addr_profile);
		let p = table::borrow(&s.profiles, user);
		p.verification_cid
	}

	// Helper function to get all profile CIDs (MUTABLE)
	#[view]
	public fun get_profile_cids_by_address(user: address): vector<vector<u8>> acquires Profiles {
		let s = borrow_global<Profiles>(@did_addr_profile);
		let p = table::borrow(&s.profiles, user);
		p.profile_cids
	}

	// Helper function to get latest profile CID
	#[view]
	public fun get_latest_profile_cid_by_address(user: address): vector<u8> acquires Profiles {
		let s = borrow_global<Profiles>(@did_addr_profile);
		let p = table::borrow(&s.profiles, user);
		let cids = &p.profile_cids;
		let len = vector::length(cids);
		assert!(len > 0, EPROFILE_NOT_FOUND);
		*vector::borrow(cids, len - 1)
	}

	public(friend) fun increase_trust_score_from_vote(user: address) acquires Profiles {
		let s = borrow_global_mut<Profiles>(@did_addr_profile);
		let p = table::borrow_mut(&mut s.profiles, user);
		let new_score = p.trust_score + 1;
		p.trust_score = if (new_score > MAX_TRUST_SCORE) { MAX_TRUST_SCORE } else { new_score };
	}

	fun update_score(addr: address, delta: u64, increase: bool, store: &mut Profiles) {
		let p = table::borrow_mut(&mut store.profiles, addr);
		let new_score = if (increase) {
			p.trust_score + delta
		} else {
			if (p.trust_score > delta) { p.trust_score - delta } else { 0 }
		};
		p.trust_score = if (new_score > MAX_TRUST_SCORE) { MAX_TRUST_SCORE } else { new_score };
	}

	public(friend) fun update_trust_score_from_vote(
		freelancer: address,
		poster: address,
		winer_is_freelancer: bool
	) acquires Profiles {
		let s_ref = borrow_global_mut<Profiles>(@did_addr_profile);
		if (winer_is_freelancer) {
			// Winner: freelancer gains, poster loses
			update_score(freelancer, 5, true, s_ref);
			update_score(poster, 5, false, s_ref);
		} else {
			// Winner: poster gains, freelancer loses
			update_score(poster, 5, true, s_ref);
			update_score(freelancer, 5, false, s_ref);
		}
	}
}


