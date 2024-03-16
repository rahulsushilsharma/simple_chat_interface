import { Autocomplete, Box, Paper, TextField } from "@mui/material";
import { useCallback, useState } from "react";
import {useDropzone} from 'react-dropzone'
import theme from "../theme";

function MyDropzone() {
  const onDrop = useCallback((acceptedFiles: any[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
      // Do whatever you want with the file contents
        const binaryStr = reader.result
        console.log(binaryStr)
      }
      reader.readAsArrayBuffer(file)
    })
    
  }, [])
  const {getRootProps, getInputProps} = useDropzone({onDrop})

  const {ref, ...rootProps} = getRootProps()

  return <Box ref={ref} sx={{
    padding:"1em",
    border:"3px dashed" + theme.palette.primary.main,
    borderRadius:"0.5em",
  }}>
    <Paper {...rootProps}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </Paper>
  </Box>

}

export default function Upload() {
  const Indexs = [
    {value:"randome-index-1", label:"randome index 1" },
    {value:"randome-index-2", label:"randome index 2" },
    {value:"randome-index-3", label:"randome index 3" },
  ]

  const [index,setIndex] = useState(undefined)
  const [showUpload,setShowUpload] = useState(false)
  
  function handleIndexChange(index:{value:string, label:string}){ 
    
  }
  return (
    <>
    <Paper>
    <Box>Upload</Box>
    <Box>
    <Autocomplete
              disablePortal
              disableClearable
              fullWidth
              value={index}
              onChange={(_e, value) => handleIndexChange(value)}
              id="combo-box-demo"
              isOptionEqualToValue={(option, value) => option.value === value.value}
              options={Indexs}
              renderInput={(params) => <TextField {...params} label="Model" />}
            />

    </Box>
    <MyDropzone/>
    </Paper>
    </>
  )
}
