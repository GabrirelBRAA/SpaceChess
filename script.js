class Board{
    constructor(){
        this.tiles= Array(64).fill(0)
        this.action = false;
        this.en_passant = false;
        this.castle_right = true;
        this.castle_left = true;
        this.castle = [];
        this.moves=[];
        
    }
    
    printBoard(){
        let tiles = this.tiles
        for (let i = 0; i < 8; ++i){
            console.log(tiles[i*8], tiles[i*8+1], tiles[i*8+2], tiles[i*8+3], tiles[i*8+4], tiles[i*8+5], tiles[i*8+6], tiles[i*8+7])
        }
    }

    putPieces(){
        let tiles = this.tiles;
        //Black pieces
        tiles[0] = 8;tiles[1] = 9;tiles[2] = 10;tiles[3] = 11;tiles[4] = 12;tiles[5] = 10;tiles[6] = 9;tiles[7] = 8;
        tiles[8] = 7;tiles[9] = 7;tiles[10] = 7;tiles[11] = 7;tiles[12] = 7;tiles[13] = 7;tiles[14] = 7;tiles[15] = 7;
        //White pieces
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
        if (position <=0 || position >= 63){
            return 0
        }
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
    findMoves(index){
        let tiles = this.tiles
        if (index == tiles[0]){
            return null;
        } else if (tiles[index] == 1 || tiles[index] == 7){
            return this.movesPawn(index);
        }else if (tiles[index] == 2 || tiles[index] == 8){
            return this.movesRook(index);
        }else if (tiles[index] == 3 || tiles[index] == 9){
            return this.movesKnight(index);
        }else if (tiles[index] == 4 || tiles[index] == 10){
            return this.movesBishop(index)
        }else if (tiles[index] == 5 || tiles[index] == 11){
            return this.movesQueen(index);
        }else if (tiles[index] == 6 || tiles[index] == 16){
            return this.movesKing(index);
        }

    }
    checkDanger(color){
        let tiles = this.tiles;
        let enemy_pieces=[];
        let danger_tiles=[]
        let opos_color;
        if (color==0){
            opos_color=1;
        } else {
            opos_color = 0;
        }
        for (let i = 0; i < 64; ++i){
            if (this.checkColor(i) == opos_color && tiles[i]!=0){
                enemy_pieces.push(i);
            }
        }
        for (let n = 0; n<enemy_pieces.length;++n){
            let piece = enemy_pieces[n];
            if (tiles[piece] == 1 || tiles[piece] == 7){
                danger_tiles.push.apply(danger_tiles, this.movesPawn(piece, false, true)[1]);
                //console.log(this.movesPawn(piece, false, true));
            } else if (tiles[piece] == 6 || tiles[piece] == 12){
                danger_tiles.push.apply(danger_tiles,this.movesKing(piece)[0])
                //console.log(this.movesKing(piece));
            } else {
                danger_tiles.push.apply(danger_tiles,this.findMoves(piece)[0])
                //console.log(this.findMoves(piece, false, true));
        }
    }
    return danger_tiles
}

    movesPawn(index, en_passant=false, check=false){ //Check is true when finding tiles in danger of being captured by the pawn.
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
                if (((index) % 8!=7 && this.checkColor(index-8+  1)==1) || (check && (index % 8!=7))){
                    captures.push(index - 8+1);
                }
                if (((index) % 8 !=0 && this.checkColor(index -8 -1)==1) || (check && (index % 8 !=0))){
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
                if (((index) % 8!=7 && this.checkColor(index+8+1)==0) || (check && (index % 8!=7))){
                  captures.push(index + 8 +1);
                }
                if (((index) % 8 !=0 && this.checkColor(index +8 -1)==0) || (check && (index % 8 !=0))){
                    captures.push(index + 8 -1);
                }
                if (en_passant && (((index % 8 !=0) && index-1 ==en_passant) || ((index % 8 !=7) && index+1 ==en_passant)) ){
                    en_passant_index=en_passant+8;
                }}}
        return [moves,captures,en_passant_index,"P"]
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
                        if (position>=0 && (this.checkMove(color,moves, captures, position)==0)){
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
                return [moves, captures, "R"]
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
        return [moves,captures, "H"]
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
        return [moves,captures, "B"]
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
        return [moves,captures, "Q"]
    }

    movesKing(index,action=false){ //If action is true, invalid moves will not be returned (king is in check).
        let tiles = this.tiles;
        let moves = [];
        let captures = [];
        let color;
        if (tiles[index] == 6){
            color = 0;
        } else if (tiles[index] == 12){
            color = 1;
        } else {
            return null;
        }
            if (index%8!==7){
                this.checkMove(color,moves,captures,index-1);
                if (index+8 <= 63){
                    this.checkMove(color,moves,captures,index+8-1);
                }
                if (index - 8 >= 0){
                    this.checkMove(color,moves,captures,index-8-1);
                }
            }
            if (index%8!==0){
                this.checkMove(color,moves,captures,index+1);
                if (index+8 <= 63){
                    this.checkMove(color,moves,captures,index+8+1);
                }
                if (index - 8 >= 0){
                    this.checkMove(color,moves,captures,index-8+1);
                }
            }
            if (index+8 <= 63){
                this.checkMove(color,moves,captures,index+8);
            }
            if (index - 8 >= 0){
                this.checkMove(color,moves,captures,index-8);
            }

            if (action){
                let danger_moves=this.checkDanger(color);
                for(let i=0; i < danger_moves.length; ++i){
                    let index_moves=moves.indexOf(danger_moves[i]);
                    let index_captures=captures.indexOf(danger_moves[i]);
                    if (index_moves != -1){
                        moves.splice(index_moves,1)
                    }
                    if (index_captures != -1){
                        captures.splice(index_captures,1)
                    }
                }

            }
            return [moves, captures, "K"];
    }
    castleMoves(color,left=true, right=true){
        let moves=[0,0]
        let white_castle_right=[60,61,62,63];
        let white_castle_left=[60,59,58,57,56];
        let black_castle_right=[4,5,6,7];
        let black_castle_left=[4,3,2,1,0];
        let danger_tiles = this.checkDanger(color);
        let tiles = this.tiles;
        if (color==0){
            let flag = 1
            if (right && this.checkColor(61)==null && this.checkColor(62)==null){
                for (let i = 0; i<4; ++i){
                    if (danger_tiles.includes(white_castle_right[i])){
                       flag = 0;
                        break
                    }
                }
                if (flag){
                    moves[1]=1;
                }
        }   flag = 1;
            if (left && this.checkColor(57)==null && this.checkColor(58)==null && this.checkColor(59)==null){
                for (let i = 0; i<5; ++i){
                    if (danger_tiles.includes(white_castle_left[i])){
                        flag = 0;
                        break
                    }
                }
                if (flag){
                    moves[0]=1;
                }
            
        }}
        else if (color==1){
            let flag = 1
            if (right && this.checkColor(5)==null && this.checkColor(6)==null){
                for (let i = 0; i<4; ++i){
                    if (danger_tiles.includes(black_castle_right[i])){
                       flag = 0;
                        break
                    }
                }
                if (flag){
                    moves[1]=1;
                }
        }   flag = 1;
            if (left && this.checkColor(3)==null && this.checkColor(2)==null && this.checkColor(1)==null){
                for (let i = 0; i<5; ++i){
                    if (danger_tiles.includes(black_castle_left[i])){
                        flag = 0;
                        break
                    }
                }
                if (flag){
                    moves[0]=1;
                }
            
        }
        }
        return moves;
    }
    gameAction(index){ //Function that interacts with html to create the game loop
        let tiles = this.tiles;
        if (this.action){

        } else {
            if (tiles[index] == 1){
                if (this.en_passant){
                    this.moves=this.movesPawn(index, this.en_passant);
                    highLight(index, this.moves, en_passant=true);
                } else {
                    this.moves=this.movesPawn(index);
                    highLight(index, this.moves);
                }
            } else if (tiles[index] == 2){
                this.moves=this.movesRook(index, this.en_passant);
                highLight(index, this.moves);

            } else if (tiles[index] == 3){
                this.moves=this.movesKnight(index, this.en_passant);
                highLight(index, this.moves);

            } else if (tiles[index] == 4){
                this.moves=this.movesBishop(index, this.en_passant);
                highLight(index, this.moves);

            } else if (tiles[index] == 5){
                this.moves=this.movesQueen(index, this.en_passant);
                highLight(index, this.moves);

            } else if (tiles[index] == 6){
                if (this.castle_left || this.castle_right){
                    let castle_moves = this.castleMoves(0, left = this.castle_left, right = this.castle_right);
                    this.moves = this.movesKing(index, this.en_passant);
                    highLight(index, this.moves, castle = castle_moves);
                } else {
                this.moves=this.movesKing(index, this.en_passant);
                highLight(index, this.moves);
                }

            } 
        }

    }
}

function highLight(index, moves_list, en_passant=false, castle=false){
    
}

function removePawn(){ //Deletes pawn image and starts the game
    let pawn=document.getElementById("pawn");
    pawn.remove();
    let main=document.getElementById("center_div");
    let board = document.createElement("div")
    board.setAttribute("class", "grid_container");

    chess_board = new Board();
    chess_board.putPieces();

    for (let i = 0; i < 64; ++i){
        let n = document.createElement("div");
        n.setAttribute("id","tile_" + i);
        n.setAttribute("class", "grid_tile");
        n.setAttribute("onclick", "chess_board.gameAction(" + i + ")")
        
        board.appendChild(n);
    }
    document.getElementById("center_div").appendChild(board);

    document.getElementById("titulo").innerText="Space Chess";
    chess_board = new Board();
    chess_board.putPieces();
    printPieces(chess_board);

}

function printPieces(board){
    
    for (let i = 0; i < 64; ++i){
        let image = document.createElement("img");
        if (board.tiles[i]==0){
            continue;
        }
        else if (board.tiles[i]==1 || board.tiles[i]==7){
            image.src = "images/pawn.png";
        }
        else if (board.tiles[i]==2 || board.tiles[i]==8){
            image.src = "images/pawn.png";
        }
        else if (board.tiles[i]==3 || board.tiles[i]==9){
            image.src = "images/knight.png";
        }
        else if (board.tiles[i]==4 || board.tiles[i]==10){
            image.src = "images/bishop.png";
        }
        else if (board.tiles[i]==5 || board.tiles[i]==11){
            image.src = "images/pawn.png";
        }
        else if (board.tiles[i]==6 || board.tiles[i]==12){
            image.src = "images/king.png";
        }
        
        image.setAttribute("class", "image")
        let id = "tile_" + i;
        let division = document.getElementById(id);
        division.appendChild(image)
    }
}

