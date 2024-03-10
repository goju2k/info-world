import { Fragment } from 'react';

export function Switch({ condition }:{condition:{if:(()=>boolean) | boolean; then:React.ReactNode;}[];}) {
  let matched = false;
  return (
    <>
      {condition.map((item, idx) => {
        
        if (matched) return null;

        const val = item.if instanceof Function ? item.if() : item.if;
        if (!val) {
          return null;
        }

        matched = true;
        
        return <Fragment key={`switch-item-${idx}`}>{item.then}</Fragment>;
      })}
    </>
  );
}