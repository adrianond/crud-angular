import { AfterViewInit, Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { PeriodicElementService } from 'src/app/service/periodic-elememt-service';
import { ElementDialogComponent } from 'src/app/shared/element-dialog/element-dialog.component';
import { PeriodicElement } from 'src/app/model/periodic-element';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [PeriodicElementService]
})
export class HomeComponent implements OnInit {
  @ViewChild(MatTable)
  table!: MatTable<any>
  displayedColumns: string[] = ['id', 'name', 'weight', 'symbol', 'actions'];
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
      .subscribe((data: PeriodicElement[]) => {
        console.log('data get', data)
        this.dataSource = data;
        console.log('dataSource', this.dataSource)
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

    dialogRef.afterClosed().subscribe(result => {
      //result -> resultado quando fecha o dialog
      if (result !== undefined) { // se cancelar ou clicar fora do modal o value será undefined
        if (this.dataSource !== undefined
          //se no datasource já conter a posição que está no resultado
          && this.dataSource.map(element => element.id).includes(result.id)) {
          //pega o datasource passando a posição do resultado e recebe o nome result
          this.dataSource[result.id - 1] = result;
          this.table.renderRows();
        } else {
          this.periodicElementService.createElement(result)
            .subscribe((data: PeriodicElement) => {
              console.log('data', data)
              console.log('result', result)
              this.dataSource.push(result);
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
    this.dataSource = this.dataSource.filter(element => element.id !== id)
    this.periodicElementService.deleteElement(id);
  }
 
}
