'use client';
import Image from "next/image";

export default function Home() {

  const onSubmit = async (data) => {
    fetch('/api/create-algorithm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(res => res.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold text-center">
        Welcome to ProJourney
      </h1>
      <button onClick={() => onSubmit('lol')} >Add Algorithm</button>
    </main>
  );
}
