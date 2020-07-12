

uniform sampler2D pointTexture;

			varying vec3 vColor;
			varying float vID;


			uniform sampler2D t_audio;

			void main() {

	float l = length( gl_PointCoord -.5 );
				if( l > .5 ){discard;}
				vec3 col = vec3(0.);
		col.xyz = texture2D(t_audio, vec2((( sin( vID )+1.)/2.) * .4 + l * .4 , 0. )).xyz;


	col *= vec3( sin(vID) * .1 + .9 , sin(vID * 3.) * .1 + .6 , sin(vID * .5) * .1 + .4);

				gl_FragColor = vec4( col, 1.0 );



			


			}

