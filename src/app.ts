import { Connector, Connect } from './'

@Connect({
  uris: 'test'
})
class MongoDB extends Connector {}


new MongoDB().connect()
