import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SongService } from '../../services/songs/song.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-song-form-component',
  imports: [ReactiveFormsModule],
  templateUrl: './song-form-component.component.html',
  styleUrl: './song-form-component.component.css'
})
export class SongFormComponent implements OnChanges{
  songForm: FormGroup;
  loading=false;
  error='';
  
  @Input() songToEdit: any = null;
  @Output()songCreated=new EventEmitter<any>();

  constructor(
    private formBuilder:FormBuilder,
    private songService: SongService,
  ){
    this.songForm=this.formBuilder.group({
      title:['',[Validators.required]],
      artist:['',[Validators.required]],
      album:['',[Validators.required]],
      genre:['',[Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['songToEdit'] && this.songToEdit) {
      this.songForm.patchValue({
        title: this.songToEdit.title || '',
        artist: this.songToEdit.artist || '',
        album: this.songToEdit.album || '',
        genre: this.songToEdit.genre || '',
      });
    }
  }
  onSubmit():void{
    if(this.songForm.invalid){
      this.songForm.markAllAsTouched();
      return;
    }

    this.loading=true;
    this.error='';

    const songData=this.songForm.value;
    const request$ = this.songToEdit
    ? this.songService.updateSong(this.songToEdit._id, songData)
    : this.songService.createSong(songData);

    request$.subscribe({
      next:()=>{
        this.loading=false;
        this.songCreated.emit(songData);
        this.resetForm();
      },
      error:(error)=>{
        this.loading=false;
        this.error=error.message || 'Error al guardar la canço. Torna-ho a intentar.';
        console.error('Error al guardar la canço:', error);
      }
    });
  }

  resetForm():void{
    this.songForm.reset({
      title:'',
      artist:'',
      album: '',
      genre: '',
    });
    this.songToEdit=null;
  }
  cancel():void{
    this.songCreated.emit(false);
  }

  hasError(controlName: string, errorType: string) {
    return this.songForm.get(controlName)?.hasError(errorType) && 
           (this.songForm.get(controlName)?.touched || this.songForm.get(controlName)?.dirty);
  }
}