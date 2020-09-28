(function (global) {

    var cinephile = {};

    /**home page links**/
    var index_movie_genres = "snippets/index-movie-genres.html";
    var movie_genres_url = "data/movie-genres.json";
    /**genre links**/
    var allMoviesUrl = "data/";
    var genreMoviesHtml = "snippets/genre-movies-list.html";
    /**movie links**/
    var movieHeaderHtml = "snippets/movie-header2.html";
    var moviePageHtml = "snippets/movie-code.html";

    // Convenience function for inserting innerHTML for 'select'
    var insertHtml = function (selector, html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    // Return substitute of '{{propName}}'
    // with propValue in given 'string'
    var insertProperty = function (string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        string = string
            .replace(new RegExp(propToReplace, "g"), propValue);
        return string;
    }

    // Show loading icon inside element identified by 'selector'.
    var showLoading = function (selector) {
        var html = "<div class='text-center'>";
        html += "<img src='images/ajax-loader.gif'></div>";
        insertHtml(selector, html);
    };

    // On page load (before images or CSS)
    document.addEventListener("DOMContentLoaded", function (event) {

        // On first load, show home view
        var header2Html = '<h2>Movie Genres</h2>';
        insertHtml('#head2',header2Html);
        loadIndexCategories();
    });

    cinephile.loadMoviePage = function(name,short_name,overview,trailer) {
        var genre = document.querySelector("h2").textContent.split(' Movies')[0];
        var genre_short = getGenreShortName(genre);
        $ajaxUtils.sendGetRequest(
            movieHeaderHtml,
            function (header_movies_html_response) {
                var categoriesHeaderViewHtml =
                    buildHeaderViewHtml(genre,
                                        genre_short,
                                        name,
                                        header_movies_html_response);
                insertHtml("#head2", categoriesHeaderViewHtml);
            },
            false);
        buildContentViewHtml(name,short_name,overview,trailer);

    };

    function buildContentViewHtml(name,short_name,overview,trailer){
        showLoading("#main-content-content");
        var categories = 
            [ { "name":name,
               "short_name":short_name,
               "overview":overview,
               "trailer":trailer

              }];

        $ajaxUtils.sendGetRequest(
            moviePageHtml,
            function (code_movies_html_response) {
                var categoriesViewHtml =
                    buildCategoriesViewHtml(categories,
                                            code_movies_html_response);
                insertHtml("#main-content-content", categoriesViewHtml);
            },
            false);
    }

    function getGenreShortName(genre_name){
        genre_name = genre_name.toLowerCase();
        var genre_short_name = genre_name.replace(/\s/g,"_");
        return genre_short_name;
    }


    function buildHeaderViewHtml(genre,
                                  genre_short,
                                  name,
                                  header_movies_html_response) {

        var finalHtml = '';

        var html = header_movies_html_response; 
        html =
            insertProperty(html, "name", name);
        html =
            insertProperty(html,
                           "genre_short",
                           genre_short);
        html =
            insertProperty(html,
                           "genre",
                           genre);
        finalHtml += html;

        return finalHtml;
    }

    // Load the menu categories view
    cinephile.loadGenreMovies= function (name, short_name) {
        var header2Html = '<h2>'+ name +' Movies</h2>';
        insertHtml('#head2',header2Html);
        showLoading("#main-content-content");
        allMoviesUrl +=short_name;
        allMoviesUrl +=".json"
        $ajaxUtils.sendGetRequest(
            allMoviesUrl,
            buildAndShowCategoriesHTML);
        allMoviesUrl="data/";
    };

    // Builds HTML for the categories page based on the data
    // from the server
    function buildAndShowCategoriesHTML (categories) {
        // Load title snippet of categories page
        // Retrieve single category snippet
        $ajaxUtils.sendGetRequest(
            genreMoviesHtml,
            function (genreMoviesHtml) {
                var categoriesViewHtml =
                    buildCategoriesViewHtml(categories,
                                            genreMoviesHtml);
                insertHtml("#main-content-content", categoriesViewHtml);
            },
            false);
    }

    // Using categories data and snippets html
    // build categories view HTML to be inserted into page
    function buildCategoriesViewHtml(categories,
                                      genreMoviesHtml) {

        var finalHtml = '';
        // Loop over categories
        for (var i = 0; i < categories.length; i++) {
            // Insert category values
            var html = genreMoviesHtml;
            var name = "" + categories[i].name;
            var short_name = categories[i].short_name;
            var overview = categories[i].overview;
            var trailer = categories[i].trailer; 
            html =
                insertProperty(html, "name", name);
            html =
                insertProperty(html,
                               "short_name",
                               short_name);
            html =
                insertProperty(html,
                               "overview",
                               overview);
            html =
                insertProperty(html,
                               "trailer",
                               trailer);
            finalHtml += html;
        }

        return finalHtml;
    }


    // Load the menu categories view
    loadIndexCategories = function () {
        showLoading("#main-content-content");
        $ajaxUtils.sendGetRequest(
            movie_genres_url,
            buildAndShowMovieGenresHTML);
    };


    // Builds HTML for the categories page based on the data
    // from the server
    function buildAndShowMovieGenresHTML (categories) {
        // Load title snippet of categories page
        $ajaxUtils.sendGetRequest(
            index_movie_genres,
            function (index_movie_genre) {
                var categoriesViewHtml =
                    buildMovieGenresViewHtml(categories,
                                             index_movie_genre);
                insertHtml("#main-content-content", categoriesViewHtml);
            },
            false);
    }


    // Using categories data and snippets html
    // build categories view HTML to be inserted into page
    function buildMovieGenresViewHtml(categories,
                                       index_movie_genre) {

        var finalHtml = '';
        // Loop over categories
        for (var i = 0; i < categories.length; i++) {
            // Insert category values
            var html = index_movie_genre;
            var name = "" + categories[i].name;
            var short_name = categories[i].short_name;
            html =
                insertProperty(html, "name", name);
            html =
                insertProperty(html,
                               "short_name",
                               short_name);
            finalHtml += html;
        }
        return finalHtml;
    }



    global.$cinephile = cinephile;

})(window);