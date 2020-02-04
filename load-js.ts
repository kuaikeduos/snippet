export function loadJs(src: string, callback?: () => void, container?: any) {
  var container = container || document.body;
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.src = src;
  container.appendChild(script);
  script.onload = function() {
    callback && callback()
  }
}