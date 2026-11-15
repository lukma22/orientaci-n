import {notFound} from 'next/navigation';
import CareerPage from '../../../components/CareerPage';
export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  if(!['derecho','ciencia-de-datos','comunicacion'].includes(slug))notFound();
  return <CareerPage slug={slug}/>;
}
