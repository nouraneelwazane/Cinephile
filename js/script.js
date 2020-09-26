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
        loadIndexCategories();
    });

    // Load the menu categories view
    cinephile.loadGenreMovies= function (name, short_name) {
        showLoading("#main-content");
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
        $ajaxUtils.sendGetRequest(
            categoriesTitleHtml,
            function (categoriesTitleHtml) {
                // Retrieve single category snippet
                $ajaxUtils.sendGetRequest(
                    categoryHtml,
                    function (categoryHtml) {
                        var categoriesViewHtml =
                            buildCategoriesViewHtml(categories,
                                                    categoriesTitleHtml,
                                                    categoryHtml);
                        insertHtml("#main-content", categoriesViewHtml);
                    },
                    false);
            },
            false);
    }


    // Using categories data and snippets html
    // build categories view HTML to be inserted into page
    function buildCategoriesViewHtml(categories,
                                      categoriesTitleHtml,
                                      categoryHtml) {

        var finalHtml = categoriesTitleHtml;
        finalHtml += "<section class='row'>";

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

        finalHtml += "</section>";
        return finalHtml;
    }


    // Load the menu categories view
    loadIndexCategories = function () {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            movie_genres_url,
            buildAndShowMovieGenresHTML);
    };


    // Builds HTML for the categories page based on the data
    // from the server
    function buildAndShowMovieGenresHTML (categories) {
        // Load title snippet of categories page
        $ajaxUtils.sendGetRequest(
            index_content_header,
            function (index_content_header) {
                // Retrieve single category snippet
                $ajaxUtils.sendGetRequest(
                    index_movie_genres,
                    function (index_movie_genre) {
                        var categoriesViewHtml =
                            buildMovieGenresViewHtml(categories,
                                                     index_content_header,
                                                     index_movie_genre);
                        insertHtml("#main-content", categoriesViewHtml);
                    },
                    false);
            },
            false);
    }


    // Using categories data and snippets html
    // build categories view HTML to be inserted into page
    function buildMovieGenresViewHtml(categories,
                                       index_content_header,
                                       index_movie_genre) {

        var finalHtml = index_content_header;
        finalHtml += "<div id='movie-genres' class='row'>";
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

        finalHtml += "</div>";
        return finalHtml;
    }



    global.$cinephile = cinephile;

})(window);