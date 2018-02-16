CompanyInfo.$inject = ['$resource', 'companyInfoResources'];

export default function CompanyInfo($resource, companyInfoResources) {
    "ngInject";

    return $resource(companyInfoResources.COMPANY_INFO, {}, {
        update: {
            method: 'PUT'
        }
    });
}