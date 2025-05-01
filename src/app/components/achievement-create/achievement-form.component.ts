import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AchievementService } from '../../services/achievements/achievement.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-achievement-form',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './achievement-form.component.html',
  styleUrl: './achievement-form.component.css'
})
export class AchievementFormComponent implements OnChanges{
  achievementForm: FormGroup;
  loading=false;
  error='';
  
  @Input() achievementToEdit: any = null;
  @Output()achievementCreated=new EventEmitter<any>();

  constructor(
    private formBuilder:FormBuilder,
    private achievementService: AchievementService,
  ){
    this.achievementForm=this.formBuilder.group({
      title:['',[Validators.required]],
      description:['',[Validators.required]],
      condition:['',[Validators.required]],
      icon:['',Validators.required],
      usersUnlocked:[['67dab4abca02f3aa7a28b6ab,68054b39c80ba7602613e70d']],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['achievementToEdit'] && this.achievementToEdit) {
      this.achievementForm.patchValue({
        title: this.achievementToEdit.title || '',
        description: this.achievementToEdit.description || '',
        condition: this.achievementToEdit.condition || '',
        icon: this.achievementToEdit.icon || '',
        usersUnlocked: this.achievementToEdit.usersUnlocked || []
      });
      console.log('longitud usersUnlocked:', this.achievementToEdit.usersUnlocked.length);
    }
  }
  onSubmit():void{
    if(this.achievementForm.invalid){
      this.achievementForm.markAllAsTouched();
      return;
    }

    this.loading=true;
    this.error='';

    const achievementData=this.achievementForm.value;
    const request$ = this.achievementToEdit
    ? this.achievementService.updateAchievement(this.achievementToEdit._id, achievementData)
    : this.achievementService.createAchievement(achievementData);

    request$.subscribe({
      next:()=>{
        this.loading=false;
        this.achievementCreated.emit(achievementData);
        this.resetForm();
      },
      error:(error)=>{
        this.loading=false;
        this.error=error.message || 'Error al guardar l\'achievement. Torna-ho a intentar.';
        console.error('Error al guardar l\'achievement:', error);
      }
    });
  }

  resetForm():void{
    this.achievementForm.reset({
      title:'',
      description:'',
      condition: '',
      icon:'',
      usersUnlocked:[]
    });
    this.achievementToEdit=null;
  }
  cancel():void{
    this.achievementCreated.emit(false);
  }

  hasError(controlName: string, errorType: string) {
    return this.achievementForm.get(controlName)?.hasError(errorType) && 
           (this.achievementForm.get(controlName)?.touched || this.achievementForm.get(controlName)?.dirty);
  }
}
