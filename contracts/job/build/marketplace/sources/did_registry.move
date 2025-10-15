module did_addr_profile::did_registry {
    use std::signer;
    use std::string::{Self, String};
    use std::vector;
    use std::table::{Self, Table};
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::account;
    use aptos_framework::timestamp;
    const ERR_DID_ALREADY_EXISTS: u64 = 1000;
    const ERR_DID_NOT_FOUND: u64 = 1001;
    const ERR_INVALID_PUBLIC_KEY: u64 = 1003;
    struct DIDDocument has store, copy, drop {
        id: String,
        controller: String,
        verification_methods: vector<VerificationMethod>,
        authentication: vector<String>,
        assertion_method: vector<String>,
        role_type: u8, // 1=freelancer, 2=poster, 3=both
        did_commitment: vector<u8>,
        profile_commitment: vector<u8>,
        skills: String,
        about: String,
        experience: String,
        created: u64,
        updated: u64,
    }

    struct VerificationMethod has store, copy, drop {
        id: String,
        controller: String,
        public_key_multibase: String,
    }

    
    struct DIDRegistry has key {
        did_documents: Table<String, DIDDocument>,
        create_events: EventHandle<DIDCreatedEvent>,
        update_events: EventHandle<DIDUpdatedEvent>,
        burn_events: EventHandle<DIDBurnedEvent>,
        registry_metadata: RegistryMetadata,
    }

    struct RegistryMetadata has store, copy, drop {
        registry_type: String,
        version: String,
        supported_methods: vector<String>,
        last_updated: u64,
    }

    struct DIDCreatedEvent has drop, store { did: String, timestamp: u64 }

    struct DIDUpdatedEvent has drop, store { did: String, timestamp: u64 }

    struct DIDBurnedEvent has drop, store { did: String, timestamp: u64 }

    fun init_module(account: &signer) {
        let supported_methods = vector::empty<String>();
        vector::push_back(&mut supported_methods, string::utf8(b"aptos"));
        vector::push_back(&mut supported_methods, string::utf8(b"key"));
        
        let registry_metadata = RegistryMetadata {
            registry_type: string::utf8(b"Aptos"),
            version: string::utf8(b"1.0.0"),
            supported_methods,
            last_updated: timestamp::now_seconds(),
        };
        
        move_to(account, DIDRegistry {
            did_documents: table::new(),
            create_events: account::new_event_handle<DIDCreatedEvent>(account),
            update_events: account::new_event_handle<DIDUpdatedEvent>(account),
            burn_events: account::new_event_handle<DIDBurnedEvent>(account),
            registry_metadata,
        });
    }


    fun build_did_doc(
        did: String,
        public_key: String,
        role_type: u8,
        did_commitment: vector<u8>,
        profile_commitment: vector<u8>,
        skills: String,
        about: String,
        experience: String,
        now: u64
    ): DIDDocument {
        let vm = VerificationMethod { id: did, controller: did, public_key_multibase: public_key };
        let vms = vector::empty<VerificationMethod>();
        vector::push_back(&mut vms, vm);
        let auth = vector::empty<String>();
        vector::push_back(&mut auth, did);
        let assert_m = vector::empty<String>();
        vector::push_back(&mut assert_m, did);
        DIDDocument { id: did, controller: did, verification_methods: vms, authentication: auth, assertion_method: assert_m, role_type, did_commitment, profile_commitment, skills, about, experience, created: now, updated: now }
    }

    fun merge_roles(current: u8, incoming: u8): u8 {
        if (incoming == 1) {
            if (current == 2) { 3 } else { 1 }
        } else if (incoming == 2) {
            if (current == 1) { 3 } else { 2 }
        } else {
            current
        }
    }

    public entry fun create_profile(
        user: &signer,
        did: String,
        role_type: u8,
        did_commitment: vector<u8>,
        profile_commitment: vector<u8>,
        skills: String,
        about: String,
        experience: String,
        table_commitment_hex: String,
        t_I_commitment: vector<u8>,
        a_commitment: vector<u8>
    ) acquires DIDRegistry {
        let _user_addr = signer::address_of(user);
        let registry = borrow_global_mut<DIDRegistry>(@did_addr_profile);
        assert!(!table::contains(&registry.did_documents, did), ERR_DID_ALREADY_EXISTS);
        let now = timestamp::now_seconds();
        let did_doc = build_did_doc(did, string::utf8(b""), role_type, did_commitment, profile_commitment, skills, about, experience, now);
        table::add(&mut registry.did_documents, did, did_doc);
        event::emit_event(&mut registry.create_events, DIDCreatedEvent { did, timestamp: now });
        did_addr_profile::zkp_lookup::set_did_commitment_internal(did, did_commitment);
        did_addr_profile::zkp_lookup::set_profile_commitment_internal(did, profile_commitment);
        did_addr_profile::zkp_lookup::add_zkp_proof_internal(did, table_commitment_hex, t_I_commitment, a_commitment);
    }

    public entry fun update_profile(
        user: &signer,
        did: String,
        role_type: u8,
        did_commitment: vector<u8>,
        profile_commitment: vector<u8>,
        skills: String,
        about: String,
        experience: String,
        table_commitment_hex: String,
        t_I_commitment: vector<u8>,
        a_commitment: vector<u8>
    ) acquires DIDRegistry {
        let _user_addr2 = signer::address_of(user);
        let registry = borrow_global_mut<DIDRegistry>(@did_addr_profile);
        assert!(table::contains(&registry.did_documents, did), ERR_DID_NOT_FOUND);
        let did_doc = table::borrow_mut(&mut registry.did_documents, did);
        did_doc.role_type = merge_roles(did_doc.role_type, role_type);
        did_doc.did_commitment = did_commitment;
        did_doc.profile_commitment = profile_commitment;
        did_doc.skills = skills;
        did_doc.about = about;
        did_doc.experience = experience;
        did_doc.updated = timestamp::now_seconds();
        event::emit_event(&mut registry.update_events, DIDUpdatedEvent { did, timestamp: timestamp::now_seconds() });
        did_addr_profile::zkp_lookup::set_did_commitment_internal(did, did_commitment);
        did_addr_profile::zkp_lookup::set_profile_commitment_internal(did, profile_commitment);
        did_addr_profile::zkp_lookup::add_zkp_proof_internal(did, table_commitment_hex, t_I_commitment, a_commitment);
    }

    #[view]
    public fun is_profile_verified(did: String, table_commitment_hex: String): bool {
        did_addr_profile::zkp_lookup::verify_zkp_proof_exists(did, table_commitment_hex)
    }

    fun is_valid_did_format(d: &String): bool {
        let bytes = string::bytes(d);
        let len = vector::length(bytes);
        if (len < 7) return false;
        if (*vector::borrow(bytes, 0) != 100 ||
            *vector::borrow(bytes, 1) != 105 ||
            *vector::borrow(bytes, 2) != 100 ||
            *vector::borrow(bytes, 3) != 58) {
            return false
        };
        
        true
    }

    public entry fun burn_did(
        user: &signer,
        did: String,
        table_commitment_hex: String,
        t_I_commitment: vector<u8>,
        a_commitment: vector<u8>
    ) acquires DIDRegistry {
        let _user_addr3 = signer::address_of(user);
        let registry = borrow_global_mut<DIDRegistry>(@did_addr_profile);
        assert!(table::contains(&registry.did_documents, did), ERR_DID_NOT_FOUND);
        let did_doc = table::borrow(&registry.did_documents, did);
        let _controller = did_doc.controller;
        let verification_methods = &did_doc.verification_methods;
        table::remove(&mut registry.did_documents, did);
        event::emit_event(&mut registry.burn_events, DIDBurnedEvent { did, timestamp: timestamp::now_seconds() });
        did_addr_profile::zkp_lookup::clear_did_internal(did);
    }
}
