uniform sampler2D t_audio;
uniform sampler2D t_matcap;

uniform samplerCube t_cubemap;

uniform vec3 c_primaryColor;

uniform vec3 handlePos;
uniform mat4 wtl;
uniform float id;
uniform float time;
uniform float sliderVal;
uniform float held;
uniform float hovered;

varying vec3 vNorm;
varying vec2 vUv;
varying vec3 vMPos;
varying vec3 vEye;
varying vec3 vPos;


$uvNormalMap
$semLookup
  $simplex

  $hsv
  
  
  const float MAX_TRACE_DISTANCE = .5;           // max trace distance
const float INTERSECTION_PRECISION = 0.01;        // precision of the intersection
const int NUM_OF_TRACE_STEPS = 20;
const float PI = 3.14159;

 float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}


float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) +
         length(max(d,0.0));
}

vec2 opS( vec2 d1, vec2 d2 )
{
    return  -d1.x > d2.x  ? vec2(-d1.x , d1.y) : d2 ;
}

vec2 opU( vec2 d1, vec2 d2 )
{
    return  d1.x < d2.x ? d1 : d2 ;
}
 


/*



*/
vec2 map( vec3 pos ){
  
  vec2 res = vec2(1.,-1.);
  
  pos *= 1.;
  
  res = opU( res , vec2( sdBox( (wtl*vec4(pos,1.)).xyz , vec3(.3,.3,.3)) , 1. ) );
  
  
  res.x -= snoise( pos * ( 1.0 + sin(id * 2.) * .5 + ((1.4+ sin(id)) * sliderVal) ) + vec3( 0., time * (sin(id)+2.) * .1,0.)) * .1;
  res = opS( vec2(sdSphere( pos -handlePos, .5),2.),res);  
  res = opU( vec2(sdSphere( pos -handlePos, .2),4.),res);
  
  
 // res = opS( vec2( sdBox( (wtl*vec4(pos * 10.,1.)).xyz -vec3(0.,0.,-.4), vec3(.2,.5,.2)) , 1. ) ,res); 

  res.x /= 10.;
  
  return res;
}

  
  
  
// Calculates the normal by taking a very small distance,
// remapping the function, and getting normal for that
vec3 calcNormal( in vec3 pos ){
    
  vec3 eps = vec3( 0.0001, 0.0, 0.0 );
  vec3 nor = vec3(
      map(pos+eps.xyy).x - map(pos-eps.xyy).x,
      map(pos+eps.yxy).x - map(pos-eps.yxy).x,
      map(pos+eps.yyx).x - map(pos-eps.yyx).x );
  return normalize(nor);
}





vec2 calcIntersection( in vec3 ro, in vec3 rd ){

    
    float h =  INTERSECTION_PRECISION*2.0;
    float t = 0.0;
    float res = -1.0;
    float id = -1.;
    
    for( int i=0; i< NUM_OF_TRACE_STEPS ; i++ ){
        
        if( h < INTERSECTION_PRECISION || t > MAX_TRACE_DISTANCE ) break;
      vec2 m = map( ro+rd*t );
        h = m.x;
        t += h;
        id = m.y;
        
    }

    if( t < MAX_TRACE_DISTANCE ) res = t;
    if( t > MAX_TRACE_DISTANCE ) id =-1.0;
    
    return vec2( res , id );
     
}

void main(){

	vec3 fNorm = vNorm; //uvNormalMap( t_normal , vPos , vUv  , vNorm , 4.1 , 1.1 );


  vec2 semLU = semLookup( normalize( vEye ) , fNorm );
  //vec4 sem = texture2D( t_matcap , semLU );  
  //vec4 aCol = texture2D( t_audio , vec2(abs(vUv.x-.5),0.) );

  vec3 dif = handlePos - vMPos;
  
  
  vec3 ro = vMPos;
  vec3 rd = normalize( vEye );
  
  vec2 res = calcIntersection( ro , rd );
  
  vec3 col;
 //  vec3 col = mix( sem.xyz,vec3(0.,0.,0.), min(1.,.1*length(vEye)));
 //col = aCol.xyz;
 
  col = vec3(length( dif ));
  
  if( res.y >= 0. ){
    
    vec3 pos = ro + rd * res.x;
    vec3 nor = calcNormal( pos );

    vec3 refl = reflect( rd , nor );
    vec3 tCol = textureCube(t_cubemap,refl).xyz;
    float eyeM = dot( rd , nor);



    if( res.y > 3. ){
      col = vec3(hovered);
    }else{

      float a = id/7.;
      a *= 6.28;
      col = tCol * ( (1.+held)* vec3( (sin( a)+1.)  * 2., (sin(a+1.)+1.) * 1.4, (sin(a+2.)+1.) * .5) * .05 +.6);//nor * .5 + .5;//vec3(1.,0.,0.);
      col *= 1.+eyeM;
    
    }
  }else{
    discard;
  }

  
  gl_FragColor = vec4( col , 1. );


}
