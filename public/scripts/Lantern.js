function Lantern( params ){

     
    var p = _.defaults( params || {} , {
  
        numRays:400,
        rayLength: 10,
        rayWidth: .2,
        lanternHeight:2,
        lanternWidth:1.3,
        emitOffset: .6
      });
      this.params = p;
    



        
  var uniforms = {
    time:G.uniforms.time,
  }
  

  
  this.rayMat= new THREE.ShaderMaterial({
    vertexShader: G.shaders.vs.lanternGlow,
    fragmentShader: G.shaders.fs.lanternGlow,
    uniforms: uniforms,  
    depthWrite:false,
    side:THREE.DoubleSide,
    transparent:true,
    opacity:1,
    blending:THREE.AdditiveBlending
  });
  
  


  
      this.rayGeo = this.CreateRayGeo();
      this.rayMesh = new T.Mesh( this.rayGeo ,this.rayMat);
      

      this.lanternGeo = this.CreateLanternGeo();
      this.lanternMat = new T.MeshBasicMaterial({
          color:0xffaa44,
          opacity:.8,

      });
      this.lanternMesh = new T.Mesh( this.lanternGeo ,this.lanternMat);

      this.mesh = this.lanternMesh;
      this.mesh.add( this.rayMesh );




}

Lantern.prototype.CreateLanternGeo = function(){
    return new T.BoxGeometry( this.params.lanternWidth * 2 , this.params.lanternHeight * 2 , this.params.lanternWidth * 2 );
}

Lantern.prototype.CreateRayGeo = function(){


    var geo = new THREE.BufferGeometry();

    var vertices = [];//new Float32Array();
    var uvs = [];

    for( var j = 0; j < 2; j++){

        var neg = (j - .5) * 2
    for( var i = 0; i < this.params.numRays; i ++ ){
        
        var x = (Math.random() *2 -1 ) * this.params.lanternWidth;
        var z = (Math.random() *2 -1 ) * this.params.lanternWidth;
        var y = neg*this.params.lanternHeight;

        v1.set( x,y,z);
        v2.set( 0,y-neg*this.params.emitOffset,0);

        v3.copy(v1);
        v3.sub(v2);

        v3.normalize();
        v5.set(0,1,0);

        v4.crossVectors( v3 , v5).normalize();

        var rayID = (j * this.params.numRays + i);
        
        var l = this.params.rayLength * (Math.random()  + .5)
        var w = this.params.rayWidth * (Math.random()  + .5)

        vertices[rayID*9 + 0 ] = v1.x;
        vertices[rayID*9 + 1 ] = v1.y;
        vertices[rayID*9 + 2 ] = v1.z;

        vertices[rayID*9 + 3 ] = v1.x + v3.x * l - v4.x * w;
        vertices[rayID*9 + 4 ] = v1.y + v3.y * l - v4.y * w;
        vertices[rayID*9 + 5 ] = v1.z + v3.z * l - v4.z * w;

        vertices[rayID*9 + 6 ] = v1.x + v3.x * l + v4.x * w;
        vertices[rayID*9 + 7 ] = v1.y + v3.y * l + v4.y * w;
        vertices[rayID*9 + 8 ] = v1.z + v3.z * l + v4.z * w;

        uvs[rayID*6 + 0 ] = .5;
        uvs[rayID*6 + 1 ] = 0;

        uvs[rayID*6 + 2 ] = 0;
        uvs[rayID*6 + 3 ] = 1;

        uvs[rayID*6 + 4 ] = 1;
        uvs[rayID*6 + 5 ] = 1;


    }}

    geo.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    geo.setAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );

    return geo;


}