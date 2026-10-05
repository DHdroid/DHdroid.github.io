#!/usr/bin/env ruby
# Preview the Markdown page without starting the full personal-site build.
Encoding.default_external = Encoding::UTF_8
require 'yaml'
require 'kramdown'
require 'kramdown-parser-gfm'
require 'liquid'
require 'webrick'

ROOT = File.expand_path('..', __dir__)
def render_page
  source = File.read(File.join(ROOT, 'TaSQ/index.md'))
  _, front_matter, markdown = source.split(/^---\s*$\n?/, 3)
  page = YAML.safe_load(front_matter)
  content = Kramdown::Document.new(markdown, input: 'GFM').to_html
  layout = File.read(File.join(ROOT, '_layouts/tasq.html'))
  Liquid::Template.parse(layout).render!('page' => page, 'content' => content)
end

if ARGV[0] == '--render'
  puts render_page
  exit
end

server = WEBrick::HTTPServer.new(
  Port: Integer(ENV.fetch('PORT', '8000')),
  BindAddress: '127.0.0.1',
  DocumentRoot: ROOT,
  AccessLog: []
)
server.mount_proc('/TaSQ/') do |request, response|
  if ['/TaSQ/', '/TaSQ/index.html'].include?(request.path)
    response['Content-Type'] = 'text/html; charset=utf-8'
    response['Cache-Control'] = 'no-store'
    response.body = render_page
  else
    WEBrick::HTTPServlet::FileHandler.new(server, File.join(ROOT, 'TaSQ')).service(request, response)
  end
end
trap('INT') { server.shutdown }
trap('TERM') { server.shutdown }
server.start
