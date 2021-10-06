import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AppSetting } from 'src/app/shared/app.setting';
import { GridComponent } from 'src/app/shared/components/grid/grid.component';
import { ButtonModel } from 'src/app/shared/models/button-model';
import { GridColumnModel } from 'src/app/shared/models/grid-column';
import { CommonBindingDataService } from 'src/app/shared/services/common-binding-data.service';

@Component({
  selector: 'app-investment',
  templateUrl: './investment.component.html',
  styleUrls: ['./investment.component.scss']
})
export class InvestmentComponent implements OnInit {
  @ViewChild(GridComponent) gridRef!: GridComponent;
  url = "mf-service/directschemes/classcodes";
  selectedFundType = 1;
  sortBy = 'Returns';
  isAsc = true;
  selectedYear = '1';
  schemeName = '';
  sortColumns = [{ key: 'Analyst Rating', name: 'Analyst Rating' }, { key: 'Past Performance', name: 'Past Performance' }, { key: 'Returns', name: 'Returns' }, { key: 'Expense Ratio', name: 'Expense Ratio' }]
  fundTypes = [
    { key: 1, name: 'Equity' },
    { key: 2, name: 'Hybrid' },
    { key: 3, name: 'Debt' },
    { key: 4, name: 'Commodity' },
    { key: 5, name: 'Other' }
  ];
  years = [
    { key: '1', name: '1 Yr' },
    { key: '3', name: '3 Yrs' },
    { key: '5', name: '5 Yrs' }
  ];
  gridColumn: GridColumnModel[] = [];
  buttons: ButtonModel[] = [];
  display: boolean = false;
  constructor(
    private datepipe: DatePipe,
    private commonBindingDataService: CommonBindingDataService
  ) { }


  ngOnInit(): void {
    this.getGridColumn();
  }

  getGridColumn() {
    this.gridColumn.push({
      field: 'data', header: 'Data', cellRendererHtml: (i: any) => this.getFundDetails(i), sort: false, resize: false, sortId: 'data'
    })
    this.gridColumn.push({
      field: 'data1', header: 'Data', cellRendererHtml: (i: any) => this.getReturns(i), sort: false, resize: false, sortId: 'data'
    })
    this.gridColumn.push({
      field: 'data2', header: 'Data', cellRendererHtml: (i: any) => this.getPerformance(i), sort: false, resize: false, sortId: 'data'
    })

    this.buttons.push(this.commonBindingDataService.buyButton);
  }

  onActionClick(event: any) {
    switch (event.class) {
      case 'BUY':
        this.onBuyClick(event.row);
        break;
      default:
        break;
    }
  }

  getFundDetails(data: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = `<div class="mutual-fund">
    <div class="mf-name">
    <a href="javascript:void(0)" class="mf-link">${data.schemeName}</a>
    </div> <div class="mf-detail">
    ${data.category} ${data.subCategory ? '-' : ''} ${data.subCategory ? data.subCategory : ''}
    </div>
    <div class="grid">
    <div class="col-6 nav-details">
    <div class="nav"><span class="nav">NAV</span><span class="nav-value">${data.navRs}</span>
    <span class="${data.change > 0 ? 'positive' : 'negative'}"><i class="${data.change > 0 ? 'pi pi-arrow-circle-up' : 'pi pi-arrow-circle-down'}" style="font-size:12px"> </i> ${parseFloat(data.change).toFixed(2)} %</span>
    <div class="as-on">as on (${this.datepipe.transform(data.navDate, 'dd MMM y')})</div>
    </div>
    </div>
    <div class="col-6 mf-ratio">
    <div class="name">${data.color}</div>
    <div class="ratio">
    <span class="${data.color === AppSetting.LOW ? 'block low active' : 'block low'}"></span>
    <span   class="${data.color === AppSetting.MODERATELY_LOW ? 'block mod-low active' : 'block mod-low'}"></span>
    <span  class="${data.color === AppSetting.MODERATE ? 'block mod active' : 'block mod'}"></span>
    <span   class="${data.color === AppSetting.MODERATELY_HIGH ? 'block mod-high active' : 'block mod-high'}"></span>
    <span   class="${data.color === AppSetting.HIGH ? 'block high active' : 'block high'}"></span>
    <span  class="${data.color === AppSetting.VERY_HIGH ? 'block very-high active' : 'block very-high'}"></span>
    </div>
    </div></div>
    </div>`;
    return eDiv;
  }

  getReturns(data: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = `<div class="returns">
    <div class="name">Returns</div> 
    <div class="return-table">
    <div class="column">
    <span class="label">1 Yr</span>
    <span class="value">${parseFloat(data.yr1ret).toFixed(2)}</span>
    </div>
    <div class="column">
    <span class="label">3 Yrs</span>
    <span class="value">${parseFloat(data.yr3ret).toFixed(2)}</span>
    </div>
    <div class="column">
    <span class="label">5 Yrs</span>
    <span class="value">${parseFloat(data.yr5ret).toFixed(2)}</span>
    </div>
    </div>
    <div class="ratio">Expense ratio:${data.expRatio} %</div>
    </div>`;
    return eDiv;
  }

  getPerformance(data: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = `<div class="performance">
    <div class="performance-name">
      Past Performance
      </div>
      <div class="star">`;
    if (data.quantitativeRating != null) {
      for (let i = 0; i < 5; i++) {
        if (i < Number(data.quantitativeRating)) {
          eDiv.innerHTML += `<i class="pi pi-star icons active"> </i>`
        } else {
          eDiv.innerHTML += `<i class="pi pi-star-o icons active"> </i>`
        }
      }
    } else {
      for (let i = 0; i < 5; i++) {
        eDiv.innerHTML += `<i class="pi pi-star-o icons"  > </i>`
      }
    }


    eDiv.innerHTML += `</div>`;

    eDiv.innerHTML += `<div class="performance-name">
  Analyst Rating
  </div>
  <div class="star">`;
    if (data.qualitativeRating != null) {
      for (let i = 0; i < 5; i++) {
        if (i < Number(data.qualitativeRating)) {
          eDiv.innerHTML += `<i class="pi pi-star  icons active" > </i>`
        } else {
          eDiv.innerHTML += `<i class="pi pi-star-o  icons active"  > </i>`
        }
      }
    } else {
      for (let i = 0; i < 5; i++) {
        eDiv.innerHTML += `<i class="pi pi-star-o  icons"  > </i>`
      }
    }
    eDiv.innerHTML += `</div></div></div>`;
    return eDiv;
  }

  changeSortType() {
    this.isAsc = !this.isAsc;
    this.gridRef.refreshList();
  }

  onFundTypeChange(data: any) {
    this.gridRef.refreshList();
  }

  onYearChange(data: any) {
    this.gridRef.refreshList();

  }

  onBuyClick(data: any) {
    this.schemeName = data.schemeName;
    this.display = true;
  }
}
