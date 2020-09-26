(function (global) {

    var cinephile = {};

    /**home page links**/
    var index_content_header = "snippets/index-header2.html";
    var index_movie_genres = "snippets/index-movie-genres.html";
    var movie_genres_url = "data/movie-genres.json";
    /**genre links**/
    var allCategoriesUrl = "data/";
    var categoryHtml = "snippets/genre-movies-list.html";
    var categoriesTitleHtml = "snippets/genre-header2.html";

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
        header2Html = '<h2>Movie Genres</h2>';
        insertHtml('#head2',header2Html);
        loadIndexCategories();
    });

    // Load the menu categories view
    cinephile.loadGenreMovies= function (name, short_name) {
        header2Html = '<h2>'+ name +' Movies</h2>';
        insertHtml('#head2',header2Html);
        showLoading("#main-content-content");
        allCategoriesUrl +=short_name;
        allCategoriesUrl +=".json"
        $ajaxUtils.sendGetRequest(
            allCategoriesUrl,
            buildAndShowCategoriesHTML);
    };
    // Builds HTML for the categories page based on the data
    // from the server
    function buildAndShowCategoriesHTML (categories) {
        // Load title snippet of categories page
        // Retrieve single category snippet
        $ajaxUtils.sendGetRequest(
            categoryHtml,
            function (categoryHtml) {
                var categoriesViewHtml =
                    buildCategoriesViewHtml(categories,
                                            categoriesTitleHtml,
                                            categoryHtml);
                insertHtml("#main-content-content", categoriesViewHtml);
            },
            false);
    }


    // Using categories data and snippets html
    // build categories view HTML to be inserted into page
    function buildCategoriesViewHtml(categories,
                                      categoriesTitleHtml,
                                      categoryHtml) {

        var finalHtml = '';

        // Loop over categories
        for (var i = 0; i < categories.length; i++) {
            // Insert category values
            var html = categoryHtml;
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