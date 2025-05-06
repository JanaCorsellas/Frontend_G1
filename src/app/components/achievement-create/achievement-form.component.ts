import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AchievementService } from '../../services/achievements/achievement.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-achievement-form',
  imports: [ReactiveFormsModule],
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
      icon:[''],
      usersUnlocked:[[]],
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

    if (!achievementData.icon || achievementData.icon.trim() === '') {
      achievementData.icon = 'https://cdn-icons-png.flaticon.com/512/2887/2887330.png'; // Replace with your actual default icon path
    }

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
