import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GridService } from '../../services/grid.service';
import { Subscription } from 'rxjs';
import { Table } from 'primeng/table';
import { LazyLoadEvent } from 'primeng/api';
import { GridModel } from '../../models/grid-model';
import { CommonBindingDataService } from '../../services/common-binding-data.service';
@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})

export class GridComponent implements OnInit {
  subscription!: Subscription;
  rowData: any[] = [];
  search = '';
  @Output() rowClickedEvent = new EventEmitter<any>();
  @Output() actionBtnClickedEvent = new EventEmitter<any>();
  @Output() totalRecordsEmitter = new EventEmitter<any>();
  @Output() getGridReference: EventEmitter<any> = new EventEmitter();
  @Input() url: any = '';
  @Input() isHeaderVisible: boolean = true;
  @Input() isDetailScreen!: Boolean;
  @Input() rowSelection = 'single';
  @Input() printUrl: any = '';
  @Input() exportUrl: any = '';
  @Input() columnDefs: any[] = [];
  @Input() actionButtonsDefs: any[] = [];
  @Input() pagination: any = true;
  @Input() paginationPageSize: any = 15;
  @Input() paginationStartPage: any = 0;
  @Input() defaultSortField = '';
  @Input() divClass = '';
  @Input() actionButtonWidth = 150;
  @Input() inputPlaceholder = '';
  @Input() overlayLoadingTemplate: any = '<span class="ag-overlay-loading-center" "style=background:red">' +
    'Please wait while your rows are loading</span>';
  @ViewChild('dt', { static: true }) dt!: Table;

  gridUrlParams = '';
  enableResize = false;
  displayRowView = false;
  rowSelectIndex = 0;
  datasource: any[] = [];
  model!: GridModel;
  totalRecords = 0;

  setRowLength = 15;
  searchText = '';
  selectedRecords: any = [];

  constructor(
    private gridService: GridService,
    private commonBindingDataService: CommonBindingDataService) { }

  ngOnInit() {
    this.dt.first = this.commonBindingDataService.queryUpdateObject.page;
    this.dt.sortOrder = this.commonBindingDataService.queryUpdateObject.sortOrder;
    this.defaultSortField = this.commonBindingDataService.queryUpdateObject.sortField;
  }

  refreshList() {
    this.fetchAndLoadData();
  }

  fetchAndLoadData() {
    const that = this;
    if (that.url) {
      const filterUrl = that.getUrl(that.url);
      this.commonBindingDataService.searchUrl = that.url;
      this.gridService.loadGridData(filterUrl).subscribe(result => {
        this.rowSelectIndex = 0;
        const model = <GridModel>result;
        if (result !== undefined) {
          this.totalRecords = model.count;
          this.totalRecordsEmitter.emit(this.totalRecords);
          that.datasource = [];
          const data = model.data === null ? [] : model.data
          data.forEach(e => {
            that.columnDefs.forEach(c => {
              if (c && c.cellRenderer) {
                e[c.field] = c.cellRenderer(e);
              } else if (c && c.cellRendererHtml) {
                e[c.field] = c.cellRendererHtml(e);
              }
              that.actionButtonsDefs.forEach(d => {
                if (d.show) {
                  e[d.label] = d.show(e);
                }
                if (d.icon) {
                  e[d.icon] = d.icon;
                }
                if (d.title) {
                  e[d.title] = d.title(e);
                }
                if (d.ariaLabel) {
                  e[d.ariaLabel] = d.ariaLabel(e);
                }
              });
            });
            that.datasource.push(e);
          });

          this.dt.first = this.commonBindingDataService.queryUpdateObject.page;
          this.commonBindingDataService.queryUpdateObject.sortOrder = this.dt.sortOrder;

          const paginatorPageLinks = document.getElementsByClassName('ui-paginator-page');
          for (let index = 0; index < paginatorPageLinks.length; index++) {
            paginatorPageLinks[index].setAttribute('aria-label', 'Page ' + paginatorPageLinks[index].textContent);
          }

        }
      });
    }
  }

  getUrl(url: any) {
    this.search = this.commonBindingDataService.searchUpdateObject.searchText;
    let params = 'page='+this.commonBindingDataService.queryUpdateObject.page + '&size=' + this.setRowLength;

    params += '&sort=';
    params += this.commonBindingDataService.queryUpdateObject.sortField;
    params += '&series=';
    params += this.commonBindingDataService.queryUpdateObject.sortOrderString;
    params += '&assetCode=';
    params += this.commonBindingDataService.queryUpdateObject.sortOrderString;

    let buildUrl = url;
    if (url.lastIndexOf('?') < 0) {
      buildUrl += '?';
    } else {
      buildUrl += '&';
    }
    if (this.url.lastIndexOf('?') < 0) {
      this.gridUrlParams = '';
    } else {
      this.gridUrlParams = this.url.substring(this.url.lastIndexOf('?'));
      this.gridUrlParams = this.gridUrlParams.replace('?', '&');
    }
    buildUrl += params;

    return buildUrl;
  }

  getUrlExport(url: any) {
    const that = this;
    let params = 'searchText=' + this.search;

    params += '&sortColumn=';
    params += this.commonBindingDataService.queryUpdateObject.sortField;
    params += '&sortType=';
    params += this.commonBindingDataService.queryUpdateObject.sortOrderString;
    let buildUrl = url;
    if (url.lastIndexOf('?') < 0) {
      buildUrl += '?';
    } else {
      buildUrl += '&';
    }
    if (this.url.lastIndexOf('?') < 0) {
      this.gridUrlParams = '';
    } else {
      this.gridUrlParams = this.url.substring(this.url.lastIndexOf('?'));
      this.gridUrlParams = this.gridUrlParams.replace('?', '&');
    }
    buildUrl += params;

    return buildUrl;
  }

  public onQuickFilterChanged($event: any) {
    if ($event.key === 'Enter') {
      this.commonBindingDataService.queryUpdateObject = JSON.parse(JSON.stringify(this.commonBindingDataService.queryDefaultObject));
      this.commonBindingDataService.searchUpdateObject = JSON.parse(JSON.stringify(this.commonBindingDataService.searchDefaultObject));
      this.commonBindingDataService.searchUpdateObject.searchText = this.search;
      this.applySearch();
      this.dt.first = 0;
    }

    if (($event.key === 'Backspace' || $event.key === 'Delete') && this.search.trim() === '') {
      this.commonBindingDataService.queryUpdateObject = JSON.parse(JSON.stringify(this.commonBindingDataService.queryDefaultObject));
      this.commonBindingDataService.searchUpdateObject = JSON.parse(JSON.stringify(this.commonBindingDataService.searchDefaultObject));
      this.applySearch();
    }
  }

  updateUrl(url: string) {
    this.url = url;
    this.dt.first = this.commonBindingDataService.queryUpdateObject.page;
    this.refreshList();
  }

  loadDatasourceLazy(event: LazyLoadEvent) {
    this.commonBindingDataService.queryUpdateObject.sortField = this.defaultSortField;
    this.commonBindingDataService.queryUpdateObject.page = (event.first === undefined ?
      (this.dt.first === undefined ? 1 : this.dt.first) : event.first);
    // this.setRowLength = event.rows;
    if (event.sortField !== undefined) {
      this.commonBindingDataService.queryUpdateObject.sortField = event.sortField;
    }
    // this.commonBindingDataService.queryUpdateObject.sortOrderString = event.sortOrder > 0 ? 'asc' : 'desc';
    this.fetchAndLoadData();
  }

  onRowSelect(event: any) {
    // this.rowClickedEvent.emit(this.selectedRecords);
    this.rowSelectIndex = event.index % this.paginationPageSize;
    this.displayRowView = true;
    // this.rowClickedEvent.emit(event);
  }



  actionBtnClick(event: any, data: any, action: string) {
    event.stopPropagation();
    const obj = { row: data, class: action };
    this.displayRowView = false;
    this.actionBtnClickedEvent.emit(obj);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getSelectedRecords() {
    return this.selectedRecords;
  }

  applySearch() {
    this.commonBindingDataService.queryUpdateObject.page = 1;
    this.fetchAndLoadData();
  }

  exportGridExcel(event: any) {
    const that = this;
    this.gridService.downloadExcelGridData(that.getUrlExport(that.exportUrl) + this.gridUrlParams);
  }

  exportGridPdf(event: any) {
    const that = this;
    this.gridService.downloadPdfGridData(that.getUrlExport(that.printUrl) + this.gridUrlParams);
  }
}