'use server';

export async function pinFileToIPFS(file: File | Blob, filename = 'upload') {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) throw new Error('Missing PINATA_JWT');

  const form = new FormData();
  form.append('file', file, filename);

  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwt}` },
    body: form,
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return { cid: data.IpfsHash as string };
}

export async function pinJsonToIPFS(json: unknown) {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) throw new Error('Missing PINATA_JWT');

  const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pinataContent: json }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return { cid: data.IpfsHash as string };
}


