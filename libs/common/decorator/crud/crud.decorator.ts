import { CrudController, CrudPlaceholderDto } from './crud.controller';
import { PARAMTYPES_METADATA } from '@nestjs/common/constants';
import { get, merge } from 'lodash';
const CRUD_ROUTES = {
  find: 'find',
  create: 'create',
  update: 'update',
  remove: 'remove',
};

const allMethods = Object.values(CRUD_ROUTES);

function cloneDecorators(from, to) {
  Reflect.getMetadataKeys(from).forEach((key) => {
    const value = Reflect.getMetadata(key, from);
    Reflect.defineMetadata(key, value, to);
  });
}
function clonePropDecorators(from, to, name) {
  Reflect.getMetadataKeys(from, name).forEach((key) => {
    const value = Reflect.getMetadata(key, from, name);
    Reflect.defineMetadata(key, value, to, name);
  });
}

export const Crud = (options: any) => {
  return (target) => {
    const Controller = target;
    const controller = target.prototype;
    const crudController = new CrudController(options.model);

    controller.crudOptions = options;

    for (const method of allMethods) {
      if (controller[method]) {
        continue;
      }
      // if (!options.config && method === CRUD_ROUTES.config) {
      //   continue;
      // }
      controller[method] = function test(...args) {
        return crudController[method].apply(this, args);
      };
      Object.defineProperty(controller[method], 'name', {
        value: method,
      });
      // clone instance decorators
      cloneDecorators(crudController, controller);
      cloneDecorators(crudController[method], controller[method]);
      // clone instance method decorators
      clonePropDecorators(crudController, controller, method);
      // clone class "method" decorators
      clonePropDecorators(CrudController, Controller, method);

      // get exists param types
      const types: [] = Reflect.getMetadata(
        PARAMTYPES_METADATA,
        controller,
        method,
      );
      Reflect.decorate(
        [
          // replace fake dto to real dto
          Reflect.metadata(
            PARAMTYPES_METADATA,
            types.map((v: any) => {
              if (get(v, 'name') === CrudPlaceholderDto.name) {
                return get(options, `routes.${method}.dto`, options.model);
              }
              return v;
            }),
          ),
          ...get(options, `routes.${method}.decorators`, []),
        ],
        controller,
        method,
        Object.getOwnPropertyDescriptor(controller, method),
      );
    }
  };
};
