import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { StorageDataService } from './../../../../services/storage-data.service';
import { Feedback } from './../../../../modulos/core/model';
import { FeedbackService } from './../../../../services/feedback.service';
import { ErrorHandlerService } from './../../../../modulos/core/error-handler.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  feedbackForm: FormGroup;

  constructor(private storageDataService: StorageDataService, private formBuilder: FormBuilder,
      private feedbackService: FeedbackService, private snackBar: MatSnackBar,
      private router: Router, private errorHandlerService: ErrorHandlerService) 
  { 
    setTimeout(() => {
      this.storageDataService.tituloBarraSuperior = 'Feedback';
    })
  }

  ngOnInit() 
  {
    this.createForm();
  }

  enviar()
  {
    const feedback = this.criarFeedback();

    this.feedbackService.cadastrarFeedback(feedback)
      .then(() => {        
        this.router.navigate(['/']);
  
        this.snackBar.open('Feedback enviado com sucesso, obrigado :)', '', { duration: 3500});
      })
      .catch(erro => {
        this.errorHandlerService.handle(erro);
      });
  }

  private criarFeedback(): Feedback
  {
    let feedback = new Feedback();
    feedback.comentario = this.feedbackForm.get('campoComentario').value;
    feedback.tipo = this.feedbackForm.get('campoTipoFeedback').value;

    // feedback.data = new Date();
    feedback.detalhesPlataforma = window.navigator.userAgent;
    feedback.idUsuario = this.storageDataService.usuarioLogado.id;

    return feedback;
  }

  private createForm()
  {
    this.feedbackForm = this.formBuilder.group({
      campoTipoFeedback: [null, Validators.required],
      campoComentario: [null, Validators.required]
    });
  }
}
