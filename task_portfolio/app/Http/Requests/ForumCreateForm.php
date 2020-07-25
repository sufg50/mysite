<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ForumCreateForm extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            //
            'poster_name'=>'required|string|max:50',
            'forum_title'=>'required|unique:forums,forum_title|string|max:50',
        ];
    }
}
