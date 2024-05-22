export type FilterOperator =
    | '='
    | '<'
    | '>'
    | '<='
    | '>='
    | '!'
    | '<>' // Between
    | '!<>' // No Between
    | '~' // contiene
    | '!~' // No contiene
    | '.~' // Inicia con
    | '~.' // Termina con
    | '!.~' // No empieza con
    | '!~.'; // No termine con
