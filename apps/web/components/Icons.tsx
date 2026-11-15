export function Icon({name}: {name:'arrow'|'back'|'download'|'repeat'|'mail'|'close'}) {
  const paths = {
    arrow:<><path d="M7 17 17 7M7 7h10v10"/></>,
    back:<><path d="m12 5-7 7 7 7M5 12h14"/></>,
    download:<><path d="M12 3v12m-5-5 5 5 5-5M5 16v4h14v-4"/></>,
    repeat:<><path d="M3 10a9 9 0 1 1 1 7M3 4v6h6"/></>,
    mail:<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></>,
    close:<path d="m6 6 12 12M6 18 18 6"/>,
  };
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
