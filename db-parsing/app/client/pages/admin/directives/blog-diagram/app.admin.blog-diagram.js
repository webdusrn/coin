export default function blogDiagram ($filter, metaManager, blogTemplatesManager, blogStatsManager, dialogHandler) {
    'ngInject';

    var templatePath = metaManager.std.templatePath;
    var attachZero = $filter('attachZero');

    return {
        restrict: 'AE',
        scope: {
            sgYear: '=',
            sgMonth: '=',
            sgBlogAccountId: '='
        },
        templateUrl: templatePath + 'admin/directives/blog-diagram/app.admin.blog-diagram.html',
        link: function (scope, element, attr) {
            var maxDate;
            var lastDay;
            
            scope.blogStats = null;
            scope.enumBlogTemplates = [];

            generateDate();
            getBlogTemplates();

            scope.$watch('sgYear', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    generateDate();
                    getBlogStats();
                }
            }, true);

            scope.$watch('sgMonth', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    generateDate();
                    getBlogStats();
                }
            }, true);

            function generateDate () {
                var temp = new Date(scope.sgYear + '-' + attachZero(scope.sgMonth) + '-01 00:00:00').getTime();
                maxDate = 32 - new Date(parseInt(scope.sgYear), parseInt(scope.sgMonth) - 1, 32).getDate();
                lastDay = Math.floor((temp + 32400000) / 86400000) + maxDate - 1;
            }

            function getBlogTemplates () {
                blogTemplatesManager.getBlogTemplates(function (status, data) {
                    if (status == 200) {
                        scope.enumBlogTemplates = [{
                            id: null,
                            title: 'total'
                        }].concat(data.rows);
                        getBlogStats();
                    } else {
                        dialogHandler.alertError(status, data);
                    }
                })
            }

            function getBlogStats () {
                var query = {
                    year: scope.sgYear,
                    month: scope.sgMonth
                };
                if (scope.sgBlogAccountId) {
                    query.blogAccountId = scope.sgBlogAccountId;
                }
                blogStatsManager.getBlogStats(query, function (status, data) {
                    if (status == 200) {
                        generateStats(data.rows);
                    } else if (status == 404) {
                        generateStats([]);
                    } else {
                        dialogHandler.alertError(status, data);
                    }
                });
            }

            function generateStats (rows) {
                var series = [];
                var data = [];
                var legend = [];
                var enumBlogTemplates = scope.enumBlogTemplates.slice(1, scope.enumBlogTemplates.length);
                for (var i=0; i<maxDate; i++) {
                    legend.push((i + 1).toString());
                }
                if (rows.length) {
                    for (var i=0; i<enumBlogTemplates.length; i++) {
                        series.push('(' + enumBlogTemplates[i].id + ') ' + enumBlogTemplates[i].title);
                        var template = [];
                        for (var j=0; j<maxDate; j++) {
                            template.push(0);
                            for (var k=0; k<rows.length; k++) {
                                if (lastDay - maxDate + 1 + j == rows[k].id) {
                                    for (var l=0; l<rows[k].blogStatsItems.length; l++) {
                                        if (rows[k].blogStatsItems[l].blogTemplateId == enumBlogTemplates[i].id) {
                                            template[j] += rows[k].blogStatsItems[l].count;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        data.push(template);
                    }
                } else {
                    for (var i=0; i<enumBlogTemplates.length; i++) {
                        series.push(scope.enumBlogTemplates[i].title);
                        var template = [];
                        for (var j=0; j<maxDate; j++) {
                            template.push(0);
                        }
                        data.push(template);
                    }
                }
                scope.blogStats = {
                    series: series,
                    data: data,
                    labels: legend,
                    options: {
                        fontSize: 14,
                        legend: {
                            display: true,
                            labels: {
                                padding: 20,
                                fontSize: 14,
                                fontColor: '#40485b'
                            }
                        }
                    }
                };
            }
        }
    }
}