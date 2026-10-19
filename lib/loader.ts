/** Runs in <head>: marks JS for reveals and shows the loading screen on every full load. On the home page a reload
    always starts at the hero: no restored scroll position and no stale hash. */
export const loaderInitScript = `try{var d=document.documentElement;d.classList.add("js");d.dataset.loading="1";if(location.pathname==="/"){history.scrollRestoration="manual";if(location.hash)history.replaceState(null,"",location.pathname+location.search);window.scrollTo(0,0);addEventListener("load",function(){window.scrollTo(0,0)})}}catch(e){}`;
