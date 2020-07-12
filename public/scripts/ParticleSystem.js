

function ParticleSystem(mat){
    var radius = 20;
    var particles = 1000;

geometry = new THREE.BufferGeometry();

var positions = [];
var colors = [];
var sizes = [];
var ids = []

var color = new THREE.Color();

for ( var i = 0; i < particles; i ++ ) {

    positions.push( ( Math.random() * 2 - 1 ) );
    positions.push( ( Math.random() * 2  -1 ) );
    positions.push( ( Math.random() * 2 - 1 ));
    ids.push( i );

    color.setHSL( i / particles, 1.0, 0.5 );

    colors.push( color.r, color.g, color.b );


}

geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
geometry.setAttribute( 'id', new THREE.Float32BufferAttribute( ids, 1 ) );


var material = new THREE.PointsMaterial( { size:.1 , vertexColors: true } );
particleSystem = new THREE.Points( geometry, mat);

return particleSystem;

}