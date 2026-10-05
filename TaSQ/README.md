# Editing the TaSQ project page

Edit **`TaSQ/index.md`** for the page title, authors, paragraphs, figure captions, and benchmark tables. Use normal Markdown: `##` for headings, `**bold**` for emphasized scores, and pipe tables for results. Leave the HTML container tags and their IDs in place; they connect the layout and selectors.

The existing GitHub Pages workflow renders this Markdown with the dedicated `_layouts/tasq.html` layout at **`/TaSQ/`**. No separate HTML copy needs updating.

## Local preview

From the repository root, run:

```sh
ruby bin/preview_tasq.rb
```

Open http://localhost:8000/TaSQ/. Save your Markdown changes and refresh the browser to see them. The preview uses the repository's Ruby gems (`kramdown`, `kramdown-parser-gfm`, `liquid`, and `webrick`). You can choose another port with `PORT=8001 ruby bin/preview_tasq.rb`.

## Supporting files

- `_layouts/tasq.html`: page shell and author block
- `TaSQ/style.css`: layout and typography
- `TaSQ/script.js`: benchmark and model selectors and TaSQ row shading
- `TaSQ/assets/`: static paper figures
- `bin/preview_tasq.rb`: local Markdown preview, excluded from the published site

The content and results come from the sibling `vq_paper` directory.
