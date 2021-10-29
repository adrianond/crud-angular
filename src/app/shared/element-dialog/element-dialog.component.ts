import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeriodicElement } from 'src/app/model/periodic-element';

@Component({
  selector: 'app-element-dialog',
  templateUrl: './element-dialog.component.html',
  styleUrls: ['./element-dialog.component.scss']
})
export class ElementDialogComponent implements OnInit {
  element!: PeriodicElement;
  ischange!: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: PeriodicElement,
    public dialogRef: MatDialogRef<ElementDialogComponent>,
  ) { }

  ngOnInit(): void {
    if (this.data.id !== null) {
      this.ischange = true;
  } else {
    this.ischange = false;
  }
}

  onCancel(): void {
    this.dialogRef.close();
  }

}
