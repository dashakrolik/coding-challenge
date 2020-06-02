import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input } from '@angular/core';
import { Square } from './square';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;
  requestId: number;
  squares: Square[] = [];

  private x = 0;
  private y = 0;
  private z = 30;
  private color = 'blue';

 @Input() results: boolean[];

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.play();
    this.ctx.fillStyle = this.color;
  }

  play = () => {
    const square = new Square(this.ctx);
    this.squares = this.squares.concat(square);

    this.squares.forEach(() => {
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.z * this.x, this.z * this.y, this.z, this.z);
    });
  }

  playAnimation = () => {
    // checks if every test was passed. If yes the square will move to the right, if not 
    // nothing will happen
    this.results.every(result => 
      // tslint:disable-next-line: no-unused-expression
      result === true ? this.moveRight() : null
    );
  }

  moveRight = () => {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.x++;
    this.ctx.fillRect(this.z * this.x, this.z * this.y, this.z, this.z);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.requestId);
  }
}


