type Subject = 'cestina' | 'dejepis' | 'hst' | 'jine';
type ApprovedState = 'approved' | 'rejected' | 'pending';
type FileType = 'pdf' | 'odt' | 'docx' | 'doc';
type Class =
  | 'R1'
  | 'R2'
  | 'R3'
  | 'R4'
  | 'R5'
  | 'R6'
  | 'R7'
  | 'R8'
  | '1A'
  | '1B'
  | '1C'
  | '2A'
  | '2B'
  | '2C'
  | '3A'
  | '3B'
  | '3C'
  | '4A'
  | '4B'
  | '4C';
export { Subject, ApprovedState, FileType, Class };
