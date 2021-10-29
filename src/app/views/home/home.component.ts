import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { PeriodicElementService } from 'src/app/service/periodic-elememt-service';
import { ElementDialogComponent } from 'src/app/shared/element-dialog/element-dialog.component';
import { PeriodicElement } from 'src/app/model/periodic-element';
import { PeriodicElementsResponse } from 'src/app/model/response/periodic-elements-response';
import { PeriodicElementResponse } from 'src/app/model/response/periodic-element-response';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [PeriodicElementService]
})
export class HomeComponent implements OnInit {
  @ViewChild(MatTable)
  table!: MatTable<any>
  displayedColumns: string[] = ['name', 'weight', 'symbol', 'actions'];
  dataSource!: PeriodicElement[];

  constructor(
    private dialog: MatDialog,
    private periodicElementService: PeriodicElementService
  ) {
    this.getElementos();
  }

  ngOnInit(): void {
  }


  getElementos() {
    this.periodicElementService.getPeriodicElements()
      .subscribe((response: PeriodicElementsResponse) => {
        this.dataSource = response.elementos;
      }, (err) => {
        console.log('Erro na consulta', err);
      })
  }


  openDialog(element: PeriodicElement | null): void {
    const dialogRef = this.dialog.open(ElementDialogComponent, {
      width: '250px',
      data: element === null ? { // estou adicionando um elemento
        id: null,
        name: '',
        weight: null,
        symbol: ''
      } : { // senao,estou alterando um elemento
        id: element.id,
        name: element.name,
        weight: element.weight,
        symbol: element.symbol
      }
    });
    //result -> resultado quando fecha o dialog
    dialogRef.afterClosed().subscribe(result => {
      // se cancelar ou clicar fora do modal o value será undefined
      if (result !== undefined) {
        //se no datasource já conter a posição que está no resultado
        if (this.dataSource.map(element => element.id).includes(result.id)) {
          this.periodicElementService.updateElement(result.id, result)
            .subscribe((response: PeriodicElementResponse) => {
              this.getElementos();
          }, (err) => {
            console.log('Erro na alteração do cadastro', err);
          });
        } else {
          this.periodicElementService.createElement(result)
            .subscribe((response: PeriodicElementResponse) => {
              this.dataSource.push(response.elemento);
              this.table.renderRows();
            }, (err) => {
              console.log('Erro no cadastro', err);
            })
        }
      }
    });
  }


  editElement(element: PeriodicElement): void {
    this.openDialog(element);
  }

  deleteElement(id: number): void {
    this.periodicElementService.deleteElement(id)
      .subscribe(() => {
        this.dataSource = this.dataSource.filter(element => element.id !== id)
      })
  }

}
