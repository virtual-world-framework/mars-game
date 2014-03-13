var MGShaders = {};

MGShaders.HDR = {

  uniforms: {

    "tDiffuse": { type: "t", value: null },
    "exposure":  { type: "f", value: 0.125 },
    "brightMax": { type: "f", value: 0.5 }

  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [

    "uniform sampler2D   tDiffuse;",
    "uniform float       exposure;",
    "uniform float       brightMax;",

    "varying vec2  vUv;",

    "vec3 decode_pnghdr( const in vec4 color ) {",

      "vec4 clr = vec4(color.xyz + 1.0, color.w);",
      "vec4 res = clr * clr;",
      "res.xyz = (res.xyz - 1.1) / 3.0;",

      "float ri = pow( 2.0, res.w * 32.0 - 16.0 );",

      "res.xyz = res.xyz * ri;",
      "return res.xyz;",

    "}",

    "void main()  {",

      "vec4 color = texture2D( tDiffuse, vUv );",
      "color.xyz  = decode_pnghdr( color );",

      "//gl_FragColor = vec4( pow( exposure * color.xyz, vec3( 0.474 ) ), 1.0 );",

      "float Y = dot(vec4(0.30, 0.59, 0.11, 0.0), color);",
      "float YD = exposure * (exposure/brightMax + 1.0) / (exposure + 1.0);",
      "color *= YD;",

      "gl_FragColor = vec4( color.xyz, 1.0 );",

    "}"

  ].join("\n")

};

MGShaders.Environment = {

  uniforms: {

    "tDiffuse": { type: "t", value: null }

  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [

    "uniform sampler2D   tDiffuse;",

    "varying vec2  vUv;",

    "void main()  {",
      "vec4 color = texture2D( tDiffuse, vUv );",
      "float avg = (color.x + color.y + color.z) / 3.0;",
      "vec4 sat = color - min(color.x, min(color.y, color.z));",
      "color += 0.95;",
      "color *= avg + 1.0;",
      "color += sat;",
      "color -= 0.95;",
      "color *= 0.5;",
      "gl_FragColor = vec4( color.xyz, 1.0 );",
    "}"

  ].join("\n")

};