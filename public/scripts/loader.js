var pathToShaders = "shaders";
var pathToChunks = "shaders";

var manager = new THREE.LoadingManager();

var neededToLoad = 0;
var loaded = 0;

var loader = new OBJLoader(manager);
var tLoader = new THREE.TextureLoader(manager);

G.shaders = new ShaderLoader(pathToShaders, pathToChunks);
G.shaders.shaderSetLoaded = function() {
  onLoad();
};

G.audio = new AudioController();
G.audio.buffers = {}

G.uniforms.t_audio.value = G.audio.texture;

clock = new THREE.Clock();

textMaker = new TextCreator(100);

