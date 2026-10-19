/** Runs in <head>: marks JS for reveals, and shows the loading screen once per visit on the home page. */
export const loaderInitScript = `try{var d=document.documentElement;d.classList.add("js");if(location.pathname==="/"&&!sessionStorage.getItem("loaded")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)d.dataset.loading="1"}catch(e){}`;
