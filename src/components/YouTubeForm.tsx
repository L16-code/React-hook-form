import { useForm, useFieldArray } from 'react-hook-form';
import { DevTool } from "@hookform/devtools";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

const schema = yup.object({
  username: yup.string().required("username is required very much"),
  email: yup.string().required("email is required").email("invalid email"),
  channel: yup.string().required("channel is required")
})

let renderCount = 0;

type FormValues = {
  username: string,
  email: string,
  channel: string
  social: {
    twitter: string
    facebook: string
  };
  phoneNumber: string[];
  phNumbers: {
    number: string;
  }[]
}

const YouTubeForm = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      username: "",
      email: "",
      channel: "",
      social: {
        twitter: "",
        facebook: ""
      },
      phoneNumber: ["", ""],
      phNumbers: [{ number: '' }]
    }
    // defaultValues:async()=>{
    //   const response=await fetch("https://jsonplaceholder.typicode.com/users")
    //   const data=await response.json()
    //   return{
    //     username:"superman",
    //     email:data[0].email,
    //     channel:"",
    //   };
    // }
    // resolver:yupResolver(schema),
  })
  const { register, control, handleSubmit, formState ,watch,getValues,setValue,reset} = form;
  const { errors ,isDirty, dirtyFields ,isValid ,isSubmitting,isSubmitted ,isSubmitSuccessful ,}  = formState;
  console.log({isSubmitSuccessful})
  const onSubmit = (data: FormValues) => {
    console.log("hello", data)
  }
  const { fields,append ,remove} = useFieldArray({
    name: 'phNumbers',
    control
  })
  const watchUsername=watch("username","email")
  renderCount++;
  const handleGetValues=()=>{
    console.log(getValues("social"))
  }
  const handleSetValues=()=>{
    setValue("social.twitter","twitter")
    setValue("social.facebook","facebook",{
      shouldDirty:true,
      shouldTouch:true
    })

  }
  return (
    <div>
      <h1>My Form ({renderCount
        / 2})</h1>
        <h2>Watched value:{watchUsername}</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" {...register("username")} />
        <p className='error'>{errors.username?.message}</p>

        <label htmlFor="email">E-mail</label>
        <input type="email" id="email" {...register("email",
          {
            pattern: {
              value: /^(?:(?!.*?[.]{2})[a-zA-Z0-9](?:[a-zA-Z0-9.+!%-]{1,64}|)|\"[a-zA-Z0-9.+!% -]{1,64}\")@[a-zA-Z0-9][a-zA-Z0-9.-]+(.[a-z]{2,}|.[0-9]{1,})$/,
              message: "invalid email"
            },
            validate: {
              notAdmin: (fieldvalue) => {
                return (
                  fieldvalue !== "admin@gmail.com" || "enter a diff email address"
                );
              },
              notBlackListed: (fieldvalue) => {
                return (
                  !fieldvalue.endsWith("yahoo.com") || "this Domain is not supported"
                );
              }
            }
          }
        )} />
        <p className='error'>{errors.email?.message}</p>

        <label htmlFor="channel">Channel</label>
        <input type="text" id="channel" {...register("channel")} />
        <p className='error'>{errors.channel?.message}</p>

        <label htmlFor="Twitter">Twitter</label>
        <input type="text" id="Twitter" {...register("social.twitter",{
          disabled:watch("channel")===""
        })} />

        <label htmlFor="facebook">FaceBook</label>
        <input type="text" id="facebook" {...register("social.facebook")} />

        <label htmlFor="phn_primary">Phone primary</label>
        <input type="text" id="phn_primary" {...register("phoneNumber.0")} />

        <label htmlFor="phn_secondary">Phone secondary</label>
        <input type="text" id="phn_secondary" {...register("phoneNumber.1")} />

        <div>
          <label htmlFor="">Html of phn numbers</label>
          <div>
            {
              fields.map((field, index) => {
                return (
                  <div className='form-control' key={field.id}>
                    <input type="text" {...register(`phNumbers.${index}.number` as const,{
                      valueAsNumber:true
                    })} />
                    {
                      index>0&&(
                        <button type='button' onClick={()=>remove(index)}>Remove</button>
                      )
                    }
                  </div>
                )
              })}
              <button type='button' onClick={()=>append({number:""})}> Add Phn Number</button>
          </div>
        </div>



        <button disabled={!isDirty || !isValid ||isSubmitting}>Submit</button>
        <button onClick={handleGetValues} type='button'>Get Values</button>
        <button onClick={handleSetValues} type='button'>Set Values</button>
        <button onClick={()=>reset()} type='button'>Reset</button>

        
      </form>
      <DevTool control={control} />
    </div>
  )
}

export default YouTubeForm