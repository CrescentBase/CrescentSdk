import livereload from 'rollup-plugin-livereload'
import rollup from './rollup.bundle.config'
import serve from 'rollup-plugin-serve'
import dev from 'rollup-plugin-dev'

let port = Math.ceil(Math.random()*10000); ;
export default Object.assign({}, rollup, {
  plugins: [...rollup.plugins,
    serve({
      port,
      open: 'true',
      openPage: 'http://127.0.0.1:' + port + '/index.html'
    }),
    dev({
      proxy: [{ from: '/track', to:'http://example.com' }],
    }),
    livereload({
      watch: ['dist', 'src']
    })
  ]
})
