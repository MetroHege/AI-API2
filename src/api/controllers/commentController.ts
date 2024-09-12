import {Request, Response, NextFunction} from 'express';
import fetchData from '../../lib/fetchData';
import {ImageGenerateParams, ImagesResponse} from 'openai/resources';
import CustomError from '../../classes/CustomError';

const commentPost = async (
  req: Request<{}, {}, {text: string}>,
  res: Response<{response: string}>,
  next: NextFunction
) => {
  try {
    if (!process.env.OPENAI_API_URL) {
      next(new CustomError('No OPENAI_API_URL in .env', 500));
      return;
    }

    const aiRequest: ImageGenerateParams = {
      model: 'dall-e-2',
      prompt: req.body.text,
      size: '256x256',
    };

    const image = await fetchData<ImagesResponse>(
      process.env.OPENAI_API_URL + '/v1/images/generations',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aiRequest),
      }
    );

    if (!image || !image.data[0].url) {
      next(new CustomError('No image data', 500));
      return;
    }

    res.json({response: image.data[0].url});
  } catch (error) {
    next(error);
  }
};

export {commentPost};
