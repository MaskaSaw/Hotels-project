export class SearchResult {
  viewField: string;
  filterData: string;
  additionalFilterData: string;
  type: string;

  constructor() {
    this.viewField = '',
    this.filterData = '',
    this.additionalFilterData = '',
    this.type = 'Empty'
  }
}