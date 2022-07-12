class Board{
    constructor(){
        this.tiles= Array(64).fill(0)
        
    }
    
    printBoard(){
        let tiles = this.tiles
        for (let i = 0; i < 8; ++i){
            console.log(tiles[i*8], tiles[i*8+1], tiles[i*8+2], tiles[i*8+3], tiles[i*8+4], tiles[i*8+5], tiles[i*8+6], tiles[i*8+7])
        }
    }

    putPieces(){
        let tiles = this.tiles;
        //Peças pretas
        tiles[0] = 8;tiles[1] = 9;tiles[2] = 10;tiles[3] = 11;tiles[4] = 12;tiles[5] = 10;tiles[6] = 9;tiles[7] = 8;
        tiles[8] = 7;tiles[9] = 7;tiles[10] = 7;tiles[11] = 7;tiles[12] = 7;tiles[13] = 7;tiles[14] = 7;tiles[15] = 7;
        //Peças brancas
        tiles[48] = 1;tiles[49] = 1;tiles[50] = 1;tiles[51] = 1;tiles[52] = 1;tiles[53] = 1;tiles[54] = 1;tiles[55] = 1;
        tiles[56] = 2;tiles[57] = 3;tiles[58] = 4;tiles[59] = 5;tiles[60] = 6;tiles[61] = 4;tiles[62] = 3;tiles[63] = 2;
    }

    checkColor(index){
         let piece = this.tiles[index]
        if (piece == 0){
            return null;
        }
        else if (1 <= piece && piece <= 6){
            return 0;
        }
        else if (7 <= piece && piece <= 12){
            return 1;
        }
    }

    checkMove(color, move_array, capture_array, position){

        if (this.checkColor(position) == null){
            move_array.push(position);
            return 1;
        } 
        else if(this.checkColor(position) == color){
            return 0;
        }
        else if(this.checkColor(position) == !color){
            capture_array.push(position);
            return 0;
        }

    }

    movesPawn(index, en_passant=false){
        let tiles = this.tiles;
         let moves=[];
         let captures = [];
         let color;
         if (tiles[index]==2){
            color = 0;
         } else if (tiles[index]==8) {
            color = 1;
         } else {
            return null;
         }
         if (color==0){
            if (index-8 >= 0){
                if ((this.checkMove(color, moves,captures, index-8)==1)){
                    if (48<=index && index <= 55){
                        this.checkMove(color, moves,captures,index-16)
                    }
                }
            }
         }
    }
    
    movesRook(index){
         let tiles = this.tiles;
         let moves=[];
         let captures = [];
         let color;
         if (tiles[index]==2){
            color = 0;
         } else if (tiles[index]==8) {
            color = 1;
         } else {
            return null;
         }
            for (let i = 0; i < 4; ++i){
                if (i==0){
                    let a = 1; // Goes to the right
                    for (let n = 1; n < 8; ++n){
                        let position = index+a*n
                        if (this.checkMove(color,moves, captures,position)==0){
                            break;
                        }
                        if (position % 8 == 7){ //Changes row
                            break;
                        }
                }}
                else if (i==1){
                    let a = -1; // Goes to the left

                    for (let n = 1; n < 8; ++n){
                        let position = index+a*n
                        if (this.checkMove(color,moves, captures, position)==0){
                            break;
                        }
                        if (position % 8 == 0){ //Changes row
                            break;
                        }}
                }
                else if (i==2){
                    let a = 8; // Goes down
                    for (let n = 1; n < 8; ++n){
                        let position = index+a*n
                        if (position > 63){
                            break;
                        }
                        if (this.checkMove(color,moves, captures,position)==0){
                            break;
                        }}
                }
                else if (i==3){
                    let a = -8; // Goes up
                    for (let n = 1; n < 8; ++n){
                        let position = index+a*n
                        if (position < 0){
                            break;
                        }
                        if (this.checkMove(color,moves, captures, position)==0){
                        break;
                        }}
                    }
                }
                return [moves, captures]
         }
    movesKnight(index){
        let tiles = this.tiles;
        let moves = [];
        let captures = [];
        let color;
        if (tiles[index] == 3){
            color = 0;
        } else if (tiles[color] == 9){
            color = 1;
        } else {
            return null;
        }
        if (index%8!=0){
            this.checkMove(color, moves, captures, index-1+16);
            this.checkMove(color, moves, captures, index-1-16);
            if ((index-1)%8!=0){
                this.checkMove(color, moves, captures, index-2+8);
                this.checkMove(color, moves, captures, index-2-8);
            }
        }
        if (index%8!=7){
            this.checkMove(color, moves, captures, index+1+16);
            this.checkMove(color, moves, captures, index+1-16);
            if ((index+1)%8!=7){
                this.checkMove(color, moves, captures, index+2+8);
                this.checkMove(color, moves, captures, index+2-8);
            }
        }
        return [moves,captures]
    }
    movesBishop(index){
        let tiles = this.tiles;
        let moves = [];
        let captures = [];
        let color;
        if (tiles[index] == 4){
            color = 0;
        } else if (tiles[color] == 10){
            color = 1;
        } else {
            return null;
        }
        for (let i = 0; i < 4; ++i){
            if (i==0){
                let a = 1; //Moves to the right
                let b = 8; //Moves up
                for(let n=1; n<8; ++n){
                    let position = index+a*n+b*n;
                    if (position > 63){
                        break;
                    } else if (this.checkMove(color, moves, captures, position) == 0){
                        break;
                    } else if (position % 8 == 7){
                        break;
                    }
                }
            } else if( i==1 ){
                let a = -1; //Moves to the left
                let b = 8; //Moves up
                for(let n=1; n<8; ++n){
                    let position = index+a*n+b*n;
                    if (position > 63){
                        break;
                    } else if (this.checkMove(color, moves, captures, position) == 0){
                        break;
                    } else if (position % 8 == 0){
                        break;
                    }
                }
            } else if( i==2 ){
                let a = 1; //Moves to the right
                let b = -8; //Moves down
                for(let n=1; n<8; ++n){
                    let position = index+a*n+b*n;
                    if (position < 0){
                        break;
                    } else if (this.checkMove(color, moves, captures, position) == 0){
                        break;
                    } else if (position % 8 == 7){
                        break;
                    }
                }
            } else if ( i==3 ){
                let a = -1; //Moves to the left
                let b = -8; //Moves down
                for(let n=1; n<8; ++n){
                    let position = index+a*n+b*n;
                    if (position < 0){
                        break;
                    } else if (this.checkMove(color, moves, captures, position) == 0){
                        break;
                    } else if (position % 8 == 0){
                        break;
                    }
                }
            }
        }
        return [moves,captures]
    }    
    movesQueen(index){
        console.log("Work in Progress")
    }
    movesKing(index){
        console.log("Work in Progress")
    }
}