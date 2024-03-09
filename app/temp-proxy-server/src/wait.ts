async function waitMain(ms:number, resolve:() => void, evaluate?:()=>boolean, time?:number) {
  setTimeout(() => {

    if (Date.now() - time > ms || (evaluate && evaluate())) {
      resolve();
      return;
    }

    waitMain(ms, resolve, evaluate, time);

  }, 200);
}

export function wait(ms:number, evaluate?:()=>boolean) {
  return new Promise<void>((resolve) => {
    waitMain(ms, resolve, evaluate, Date.now());
  });
}