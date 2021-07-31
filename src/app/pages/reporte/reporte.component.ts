import { Component, OnInit } from '@angular/core';
import { ConsultaService } from 'src/app/_service/consulta.service';
import { Chart } from 'chart.js';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuService } from 'src/app/_service/menu.service';
import { RefreshMenuService } from 'src/app/_service/refreshMenu.service';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
})
export class ReporteComponent implements OnInit {
  //creacion de variables
  pdfSrc: string;
  tipo: string = 'line';
  chart: any;
  nombreArchivo: string;
  //variable tipo FileList para subir archivos
  archivosSeleccionados: FileList;
  //variable para mostrar y ocultar imagen
  imagenEstado: boolean = false;
  imagenData: any;
  usuario: string;

  constructor(
    private consultaService: ConsultaService,
    //para que muestre la imagen base64,
    //ya que sino se utiliza el navegador bloquea
    //con esta clase aseguramos al navegador que es seguro mostrar
    private sanitization: DomSanitizer,
    private menuService: MenuService,
    private refreshMenu: RefreshMenuService
    ) {}

  ngOnInit(): void {
      //guardamos el usuario del token a nuestra variable
      this.usuario = this.refreshMenu.mostrarMenu().username;

      this.menuService.listarPorUsuario(this.usuario).subscribe((data) => {
        //para que refresque las opciones de menu de acuerdo al usuario
        this.menuService.setMenuCambio(data);
      });
    //inicializamos el servicio y esa data lo convertimos para que se muestre
    //ya que el backend devuelve un arreglo de bytes
    this.consultaService.leerArchivo().subscribe(data => {
      this.convertir(data);
    });
    //inicializamos el metodo dibujar
    this.dibujar();
  }

  convertir(data: any){//recibe tipo any
    let reader = new FileReader();//Esta clase convertira el array
    reader.readAsDataURL(data);//almacenados el array en FILEREADER
    reader.onloadend = () => {//ABRIMOS EL ARCHIVO
      let base64 = reader.result;//CONVERTIRMOS EL ARRAY A BASE64
      //console.log(base64);
      //ENVIAMOS AL METODO SANAR PARA QUE NOS SANE LA IMAGEN Y SE PUEDA MOSTRAR
    this.sanar(base64);
    }
  }

  sanar(base64: any){//RECIBIMOS EL ARCHIVO Y SE DAMOS SEGURIDAD PARA QUE EL NAVEGADOR NO BLOQUEE
    this.imagenData = this.sanitization.bypassSecurityTrustResourceUrl(base64);
    //ACTIVAMOS EL IMAGENESTADO
    this.imagenEstado = true;
  }

  //INTERACTUA CON EL FRONT, RECIBE EL TIPO Y EL CHART SE CAMBIA
  cambiar(tipo: string) {
    this.tipo = tipo;
    //Para eliminar el lienzo que existe
    if (this.chart != null) {
      this.chart.destroy();
    }
    this.dibujar();
  }

  //el chart espera dos arreglos
  //entonces separamos el json por arreglos
  dibujar() {
    this.consultaService.listarResumen().subscribe((data) => {
      let cantidades = data.map((x) => x.cantidad);
      let fechas = data.map((x) => x.fecha);
      this.chart = new Chart('canvas', {
        type: this.tipo,
        data: {
          labels: fechas,
          datasets: [
            {
              label: 'Cantidad',
              data: cantidades,
              borderColor: '#3cba9f',
              fill: false,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 0, 0.2)',
                'rgba(255, 159, 64, 0.2)',
              ],
            },
          ],
        },
        options: {
          legend: {display: true,},
          scales: {
            xAxes: [
              {display: true,},
            ],
            yAxes: [
              {
                display: true,
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    });
  }

  // PDF
  generarReporte() {
    this.consultaService.generarReporte().subscribe((data) => {
      let reader = new FileReader(); //Inicailizar reader
      reader.onload = (e: any) =>{
        this.pdfSrc = e.target.result;//obtiene el mismo pdfSrc par amostrar
        console.log(this.pdfSrc);
      }
      reader.readAsArrayBuffer(data);//dEVOLVEMOS EL ARCHIVO
    });
  }

  descargarReporte() {
    this.consultaService.generarReporte().subscribe((data) => {
      const url = window.URL.createObjectURL(data);//apartir del BLOB que viene del servicio se general la URL
      //console.log(url);
      const a = document.createElement('a');//creo una etiqueta LINK
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = url; //le adiciono al href la url
      a.download = 'archivo.pdf';//NOMBRE DE LA DESCARGA
      a.click();
    });
  }

  seleccionarArchivo(e: any) {
    this.nombreArchivo = e.target.files[0].name;//DEL EVENTO SELECCIONA EL ARCHIVO
    this.archivosSeleccionados = e.target.files;//AGREGA A UNA LISTA
  }

  subirArchivo(){//GUARDA ARCHIVO LA POSISION 0
    this.consultaService.guardarArchivo(this.archivosSeleccionados.item(0)).subscribe();
  }

}

