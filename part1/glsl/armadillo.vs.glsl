
uniform vec3 lightPosition;

uniform mat4 rotationMatrix;

out vec3 colour;

#define PELVIS_HEIGHT 25.0
#define LOWER_PELVIS 24.0


void main() {
    vec4 worldPos;
    vec4 vertexNormal;
    float vertexColour;
    vec3 lightDirection;
    float dst = PELVIS_HEIGHT- position.y;
    float alpha = 1.0/pow(1.1, dst);
    vec4 weightedPos = modelMatrix * rotationMatrix * vec4(position, 1.0);
    vec4 weightedNorm = normalize(vec4(normalMatrix * (inverse(transpose(rotationMatrix))* vec4(normal,0.0)).xyz,0.0));
    if (position.y > PELVIS_HEIGHT) {
      worldPos = weightedPos;
      vertexNormal = weightedNorm;
      lightDirection = normalize(vec3(viewMatrix*(vec4(lightPosition - worldPos.xyz, 0.0))));
      vertexColour = dot(lightDirection, vertexNormal.xyz);
    } else {
      worldPos = mix(modelMatrix * vec4(position, 1.0), weightedPos, alpha);
      vertexNormal = mix(normalize(vec4(normalize(normalMatrix*normal),0.0)), weightedNorm, alpha);
      lightDirection = normalize(vec3(viewMatrix*(vec4(lightPosition - worldPos.xyz, 0.0))));
      vertexColour = dot(lightDirection, vertexNormal.xyz);
    }


    colour = vec3(vertexColour);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
    
}