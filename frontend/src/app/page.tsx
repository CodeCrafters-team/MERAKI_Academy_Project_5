'use client';

import { useDispatch,useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch } from '@/redux/store';


export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const token = useSelector((state: any) => state.auth.token);
console.log(token);


  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
