import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ImagenesService } from 'src/app/services/imagenes.service';

@Component({
  selector: 'app-imagenes',
  templateUrl: './imagenes.component.html',
  styleUrls: ['./imagenes.component.css']
})
export class ImagenesComponent implements OnInit {

  public imagenes = [] as any;

  public documentId ='';
  public currentStatus = 1;

  public imgForm = new FormGroup({
    descripcion: new FormControl('',Validators.required),
    url : new FormControl ('',Validators.required),
    id : new FormControl ('')
  });

  constructor(private imagenesService:ImagenesService) {
    this.imgForm.setValue({
      id:'',
      descripcion:'',
      url:''
    });
   }

  ngOnInit(): void {
    this.imagenesService.getImagenes().subscribe((imgSnapshot) => {
      this.imagenes = [];
      imgSnapshot.forEach((imgData:any)=>{
        this.imagenes.push({
          id: imgData.payload.doc.id,
          data: imgData.payload.doc.data()
          
        });
      })

    });
  }

  //método para agregar un documento nuevo o actulizar uno existente
  public saveImagen(form:any,documentId= this.documentId){
    //si currentStatus es 1, quiere decir que estamos por insertar un nuevo doc
    if(this.currentStatus == 1){
      let data = {
        descripcion: form.descripcion,
        url: form.url
      }
      this.imagenesService.createImagen(data).then(() =>{
        this.imgForm.setValue({
          descripcion: '',url: '', id:''
        });
      },(error) => {
        console.log(error);
      }
      );
    }else{
      let data = {
        descripcion: form.descripcion,
        url: form.url
      }
      this.imagenesService.updateImagen(documentId,data).then(() => {
        this.currentStatus = 1;
        this.imgForm.setValue({
          descripcion: '',url: '', id:''
        });
      })
    }

  }

  //método para que al darle click al boton de editar se envien los datos al formulario
  public editarImagen(documentId:string){
    let subscribe = this.imagenesService.getImagen(documentId).subscribe((img:any) => {
      this.currentStatus = 2;
      this.documentId = documentId;
      this.imgForm.setValue({
        id:documentId,
        descripcion: img.payload.data()['descripcion'],
        url: img.payload.data()['url']
      });
      subscribe.unsubscribe();
    })
  }
      //método para que al darle clic al boton de eliminar, se elimine el doc
      public deleteImagen(documentId:string){
        this.imagenesService.deleteImagen(documentId).then(() =>{
        console.log('documento eliminado');        
        }, (error) =>{
          console.log(error);
        })
      }
    }

