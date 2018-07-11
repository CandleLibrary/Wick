# WICK

version: 0.2.2 Alpha

## Boyah!

Ready to make your website zing, pop, and zoom? Tired of dealing with new languages and different methodologies when all you really want is a basic JavaScript library that takes the grunt work out of dealing with single-page-apps (SPA)? Great! Wick.

## But wait, what is Wick?

Wick is a multi paradigm system that is focused on providing a data driven, modern standards appreciating framework for the creation of single-page-app (SPA) style sites. Wick provides a number of tools for quickly creating sites that act as apps, while still providing a browser aware website that respects RESTful methodologies. This means that you can have your cake, and eat it too!

Wick does it's best to embrace the Web as largely know it to be, a collection of documents accessible through the HTTP(S) protocol. With Wick, Styles stay in cascading style sheets, JavaScript stays in .js documents, and HTML markup stays in, well, .HTMLs. This separation, though it may seem to lead to extra work, preserves the now natural way websites are organized today. Turning an existing site into a Wick enabled site takes little work, as Wick will integrate naturally with the they documents are organized. The best part is, Wick is designed to be an opt-in system. It can be totally ignored on pages, and all will be fine. Well, maybe, no one likes to be completely ignored.

### URLs

Wick uses URLs as they are intended, a way to fetch a resource from a remote location. Links work the way you expect them to work. But, there's no need to hassle with URL mangling and hash tagging to get your site to respect your SPA will. Wick automatically handles same domain and cross-domain URLs, providing a way to organize your site and pages traditionally, with the knowledge that no matter how the user navigates to your site, it will act like a single page app once they are there.

Wick takes advantage of URL query syntax to pass data between pages. This is the heart of the RESTful nature of Wick. Data is stored in the URL and allows pages to be indexed and bookmarked.  

### Pages

Though Wick is designed with SPA notions in mind, different views are still analogous to different documents served from the server. Thus, every time the user changes the URL within the site, the Wick ends pulling a new document from the server. So we maintain the name `page` for this new document, even if the browser itself does not appear to have loaded a new page.

### Forms

Forms can be easily created, and Wick will automatically validate the information before submitting.

### Animation

Wick provides an animation library to handle transition of pages. The library utilizes CSS whenever possible, but provides a fallback to JavaScript when CSS is unavailable.

### Performance

Wick uses caching and selective dumping of data to handle Performance. Upfront validation is also used, which means data and validated before it is integrated into the system. This might cause extra overhead Upfront, but this is balanced by the fact that data that passes validations can be used without further validation.

## Great! What now?

Have we held your attention so far? Great! Let's dig into wick and see how we can put it to use. Visit the following links to learn more:

[Getting Started](https://galactrax.github.io/wick/documents/getting_started_with_wick.html)

[API](https://galactrax.github.io/wick/documents/api/index.html)

[Examples](https://galactrax.github.io/wick/documents/examples.html)
