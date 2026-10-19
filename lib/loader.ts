/** Runs in <head>: marks JS for reveals and shows the loading screen on every full load. On the home page a reload
    always starts at the hero: no restored scroll position and no stale hash. If the app never boots (a failed
    script), the loading screen still clears after 10 s. */
export const loaderInitScript = `try{var d=document.documentElement;d.classList.add("js");d.dataset.loading="1";setTimeout(function(){delete d.dataset.loading},10000);if(location.pathname==="/"){history.scrollRestoration="manual";if(location.hash)history.replaceState(null,"",location.pathname+location.search);window.scrollTo(0,0);addEventListener("load",function(){if(d.dataset.loading)window.scrollTo(0,0)})}}catch(e){}`;
