import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaisSmall } from '../../interfaces/paises.interfaces';
import { PaisesService } from '../../services/paises.service';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.formBuilder.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  })


  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: string [] = [];


  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap((_) => {
         
          this.miFormulario.get('pais')?.reset(''); // cada vez que la región cambia, ponemos ese valor vacío
        }),
        switchMap(region => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
      });

        //cuando cambiar el pais

        this.miFormulario.get('pais')?.valueChanges
        .pipe(
          tap((_)=> this.miFormulario.get('frontera')?.reset('')),
          
          switchMap(codigo=> this.paisesService.getPaisPorCodigo(codigo))
        )
        .subscribe(paisResult=>{
          if(paisResult !== null ){
            if(paisResult.length > 0){
              this.fronteras = paisResult[0]?.borders;
              console.log(this.fronteras);
            }
          }  
        })
  }





  guardar() {
    console.log(this.miFormulario.value);
  }

  constructor(private formBuilder: FormBuilder, private paisesService: PaisesService) { }
}
