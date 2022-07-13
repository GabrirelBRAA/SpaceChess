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

    checkMove(color, move_array, capture_array, position,pawn_move=false){

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
         let en_passant_index=false;
         if (tiles[index]==1){
            color = 0;
         } else if (tiles[index]==7) {
            color = 1;
         } else {
            return null;
         }
         if (color==0){
            if (index-8 >= 0){
                if (this.checkColor(index-8)==null){
                    moves.push(index-8);
                    if (48<=index && index <= 55 && this.checkColor(index-16)==null){
                        moves.push(index-16);
                    }
                }
                if ((index) % 8!=7 && this.checkColor(index-8+  1)==1){
                    captures.push(index - 8+1);
                }
                if ((index) % 8 !=0 && this.checkColor(index -8 -1)==1){
                    captures.push(index - 8 -1);
                }
                if (en_passant && (((index % 8 !=0) && index-1 ==en_passant) || ((index % 8 !=7) && index+1 ==en_passant)) ){
                    en_passant_index=en_passant-8;
                }
            }
         }
        else if(color==1){
            if (index+8 <= 63){
                if (this.checkColor(index+8)==null){
                    moves.push(index+8);
                    if (8<=index && index <= 15 && this.checkColor(index+16)==null){
                        moves.push(index+16);
                    }
                }
                if ((index) % 8!=7 && this.checkColor(index+8+1)==0){
                  captures.push(index + 8 +1);
                }
                if ((index) % 8 !=0 && this.checkColor(index +8 -1)==0){
                    captures.push(index + 8 -1);
                }
                if (en_passant && (((index % 8 !=0) && index-1 ==en_passant) || ((index % 8 !=7) && index+1 ==en_passant)) ){
                    en_passant_index=en_passant+8;
                }}}
        return [moves,captures,en_passant_index]
        }

    
    movesRook(index, queen = false){
         let tiles = this.tiles;
         let moves=[];
         let captures = [];
         let color;
         if (tiles[index]==2 || queen == 5){
            color = 0;
         } else if (tiles[index]==8 || queen == 11) {
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
        } else if (tiles[index] == 9){
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
    movesBishop(index,queen=false){
        let tiles = this.tiles;
        let moves = [];
        let captures = [];
        let color;
        if (tiles[index] == 4 || queen == 5 ){
            color = 0;
        } else if (tiles[index] == 10 || queen == 11){
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
        let tiles = this.tiles;
        let moves = [];
        let captures = [];
        let color;
        if (tiles[index] == 5){
            color = 0;
        } else if (tiles[index] == 11){
            color = 1;
        } else {
            return null;
        }
        if (color==0){
            let rook = this.movesRook(index,5);
            let bishop = this.movesBishop(index,5);
            moves.push.apply(moves,rook[0]);moves.push.apply(moves,bishop[0]);
            captures.push.apply(captures,rook[1]);captures.push.apply(captures,bishop[1]);
        } else if (color == 1){
            let rook = this.movesRook(index,11);
            let bishop = this.movesBishop(index,11);
            moves.push.apply(moves,rook[0]);moves.push.apply(moves,bishop[0]);
            captures.push.apply(captures,rook[1]);captures.push.apply(captures,bishop[1]);
        }
        return [moves,captures]
    }
    movesKing(index){
        console.log("Work in Progress")
    }
}