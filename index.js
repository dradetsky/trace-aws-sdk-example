const { NodeTracerProvider } = require('@opentelemetry/node')
const { ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/tracing')
const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector')

const exporter = new CollectorTraceExporter({
  serviceName: 'basic-service',
  url: 'http://localhost:55681/v1/trace'
})
const provider = new NodeTracerProvider({
  plugins: {
    'aws-sdk': {
      // NOTE: hafta specify the path; unlike most plugins, it will not work
      // without the path argument
      path: 'opentelemetry-plugin-aws-sdk',
      enabled: true
    },
    https: {
      // don't need path here tho
      enabled: true
    }
  }
})
provider.addSpanProcessor(new SimpleSpanProcessor(exporter))
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()))
provider.register()


const aws = require('aws-sdk')
const s3 = new aws.S3({
  region: 'us-west-1',
  apiVersion: '2006-03-01'
})

const main = async () => {
  const res = await s3.listBuckets().promise()
  console.log(res)
}

main()
